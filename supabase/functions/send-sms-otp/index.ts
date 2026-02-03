import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory rate limiting (resets on function restart, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_HOUR) {
    return true;
  }
  
  record.count++;
  return false;
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP for storage
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Normalize phone number to E.164 format
function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, "");
  
  // Handle Israeli numbers
  if (digits.startsWith("972")) {
    return "+" + digits;
  }
  if (digits.startsWith("0")) {
    return "+972" + digits.substring(1);
  }
  
  // Default: assume Israeli number if starts with 5
  if (digits.startsWith("5") && digits.length === 9) {
    return "+972" + digits;
  }
  
  return "+" + digits;
}

// Validate phone number (basic validation)
function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Israeli mobile numbers: +972 followed by 9 digits starting with 5
  const israeliMobileRegex = /^\+972[5][0-9]{8}$/;
  // General international format: + followed by 10-15 digits
  const internationalRegex = /^\+[1-9][0-9]{9,14}$/;
  
  return israeliMobileRegex.test(normalized) || internationalRegex.test(normalized);
}

interface SMSRequest {
  phone: string;
  action: "send" | "verify";
  code?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, action, code }: SMSRequest = await req.json();

    // Validate phone
    if (!phone || !isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ error: "מספר טלפון לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    // Get IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "send") {
      // Rate limiting by IP and phone
      const rateLimitKey = `sms_${clientIP}_${normalizedPhone}`;
      if (isRateLimited(rateLimitKey)) {
        return new Response(
          JSON.stringify({ error: "יותר מדי בקשות. נסה שוב מאוחר יותר" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate OTP
      const otp = generateOTP();
      const otpHash = await hashOTP(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing OTP for this phone
      await supabase
        .from("sms_otp_tokens")
        .delete()
        .eq("phone", normalizedPhone);

      // Store hashed OTP
      const { error: insertError } = await supabase
        .from("sms_otp_tokens")
        .insert({
          phone: normalizedPhone,
          code_hash: otpHash,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error("Error storing OTP:", insertError);
        throw new Error("שגיאה בשמירת קוד האימות");
      }

      // Send SMS via Vonage
      const vonageApiKey = Deno.env.get("VONAGE_API_KEY");
      const vonageApiSecret = Deno.env.get("VONAGE_API_SECRET");

      if (!vonageApiKey || !vonageApiSecret) {
        console.error("Vonage credentials not configured");
        throw new Error("שירות SMS לא מוגדר");
      }

      const smsResponse = await fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: vonageApiKey,
          api_secret: vonageApiSecret,
          to: normalizedPhone.replace("+", ""),
          from: "MazonHaosher",
          text: `קוד האימות שלך הוא: ${otp}\nתוקף: 10 דקות`,
        }),
      });

      const smsResult = await smsResponse.json();
      console.log("SMS send result:", JSON.stringify(smsResult));

      if (smsResult.messages?.[0]?.status !== "0") {
        console.error("SMS send failed:", smsResult);
        throw new Error("שגיאה בשליחת SMS");
      }

      return new Response(
        JSON.stringify({ success: true, message: "קוד נשלח בהצלחה" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      if (!code || code.length !== 6) {
        return new Response(
          JSON.stringify({ error: "קוד אימות לא תקין" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const codeHash = await hashOTP(code);

      // Find matching OTP
      const { data: otpRecord, error: fetchError } = await supabase
        .from("sms_otp_tokens")
        .select("*")
        .eq("phone", normalizedPhone)
        .eq("code_hash", codeHash)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (fetchError || !otpRecord) {
        return new Response(
          JSON.stringify({ error: "קוד אימות שגוי או פג תוקף" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark as verified
      await supabase
        .from("sms_otp_tokens")
        .update({ verified: true })
        .eq("id", otpRecord.id);

      return new Response(
        JSON.stringify({ success: true, verified: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "פעולה לא תקינה" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-sms-otp:", error);
    return new Response(
      JSON.stringify({ error: error.message || "שגיאה בשרת" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
