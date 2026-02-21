import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OTPRequest {
  email: string;
  action: "send" | "verify";
  code?: string;
}

// Rate limiting - 3 OTP sends per hour per IP
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check and update rate limit
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limitData = rateLimiter.get(ip);

  if (!limitData || now > limitData.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
  }

  if (limitData.count >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  limitData.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - limitData.count };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action, code }: OTPRequest = await req.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "כתובת אימייל לא תקינה" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Cleanup expired tokens (run occasionally)
    try {
      await supabase.rpc("cleanup_expired_otp_tokens");
    } catch {
      // Ignore cleanup errors
    }

    if (action === "send") {
      // Check rate limit
      const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                       req.headers.get("cf-connecting-ip") || 
                       "unknown";
      
      const rateLimit = checkRateLimit(clientIP);
      if (!rateLimit.allowed) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`);
        return new Response(
          JSON.stringify({ error: "יותר מדי בקשות. נסה שוב מאוחר יותר" }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Generate OTP and hash it with bcrypt
      const otp = generateOTP();
      const codeHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiration

      // Delete any existing OTP for this email
      await supabase
        .from("otp_tokens")
        .delete()
        .eq("email", email);

      // Store new OTP in database
      const { error: insertError } = await supabase
        .from("otp_tokens")
        .insert({
          email,
          code_hash: codeHash,
          expires_at: expiresAt,
        });

      if (insertError) {
        console.error("Error storing OTP:", insertError);
        throw new Error("שגיאה בשמירת קוד האימות");
      }

      // Send email with OTP
      const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png";
      const emailResponse = await resend.emails.send({
        from: "מזון האושר <noreply@mazonhaosher.co.il>",
        to: [email],
        subject: "קוד אימות - מזון האושר",
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="he">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Heebo', Arial, sans-serif; background-color: #fdf8f6;">
            <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
              <!-- Solid luxurious container -->
              <div style="background: #ffffff; border-radius: 24px; padding: 50px 40px; border: 2px solid #e85d8f; box-shadow: 0 20px 60px rgba(232, 93, 143, 0.15);">
                
                <!-- Large Logo -->
                <div style="text-align: center; margin-bottom: 35px;">
                  <img src="${logoUrl}" alt="מזון האושר" style="max-width: 220px; height: auto; filter: drop-shadow(0 4px 12px rgba(232, 93, 143, 0.3));" />
                </div>
                
                <!-- Decorative divider -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="height: 2px; background: linear-gradient(90deg, transparent, #e85d8f, transparent); max-width: 200px; margin: 0 auto;"></div>
                </div>
                
                <!-- OTP Code Box -->
                <div style="background: #fdf8f6; border-radius: 20px; padding: 35px; text-align: center; border: 1px solid #f0d5dc;">
                  <p style="font-size: 18px; color: #555; margin: 0 0 25px 0; font-weight: 500;">קוד האימות שלך:</p>
                  <div style="background: linear-gradient(135deg, #e85d8f 0%, #d14d7f 100%); border-radius: 16px; padding: 25px 30px; display: inline-block; box-shadow: 0 8px 25px rgba(232, 93, 143, 0.35);">
                    <span style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${otp}</span>
                  </div>
                  <p style="font-size: 14px; color: #888; margin: 25px 0 0 0;">⏰ הקוד תקף ל-5 דקות</p>
                </div>
                
                <!-- Footer text -->
                <p style="font-size: 13px; color: #999; text-align: center; margin: 30px 0 0 0; line-height: 1.6;">
                  אם לא ביקשת קוד זה, התעלם מהודעה זו.
                </p>
                
                <!-- Brand footer -->
                <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid #f0d5dc;">
                  <p style="color: #e85d8f; font-weight: 700; font-size: 18px; margin: 0;">מזון האושר 🍪</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("OTP email sent:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, message: "קוד אימות נשלח למייל" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else if (action === "verify") {
      if (!code) {
        return new Response(
          JSON.stringify({ error: "קוד אימות חסר" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Fetch the latest non-verified OTP for this email
      const { data: otpData, error: fetchError } = await supabase
        .from("otp_tokens")
        .select("*")
        .eq("email", email)
        .eq("verified", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpData) {
        return new Response(
          JSON.stringify({ error: "קוד אימות שגוי", valid: false }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check expiration
      if (new Date(otpData.expires_at) < new Date()) {
        await supabase.from("otp_tokens").delete().eq("id", otpData.id);
        return new Response(
          JSON.stringify({ error: "קוד האימות פג תוקף", valid: false }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Compare using bcrypt
      const isValid = await bcrypt.compare(code, otpData.code_hash);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "קוד אימות שגוי", valid: false }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark OTP as verified and delete it
      await supabase
        .from("otp_tokens")
        .delete()
        .eq("id", otpData.id);

      return new Response(
        JSON.stringify({ success: true, valid: true, message: "קוד אומת בהצלחה" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "פעולה לא תקינה" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "שגיאה בשליחת קוד אימות" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);