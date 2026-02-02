import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

// Store OTPs in memory with expiration (in production, use a database table)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean expired OTPs
function cleanExpiredOTPs() {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
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

    cleanExpiredOTPs();

    if (action === "send") {
      // Generate and store OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
      
      otpStore.set(email, { code: otp, expiresAt });

      // Send email with OTP
      // Use Resend's verified domain - for production, verify your own domain at https://resend.com/domains
      const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "מזון האושר <onboarding@resend.dev>";
      
      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: "קוד אימות - מזון האושר 🍪",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #D4A574; margin: 0;">מזון האושר 🍪</h1>
            </div>
            <div style="background: #f8f4f0; border-radius: 12px; padding: 24px; text-align: center;">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">קוד האימות שלך הוא:</p>
              <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #D4A574;">${otp}</span>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 16px;">הקוד תקף ל-5 דקות</p>
            </div>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
              אם לא ביקשת קוד זה, התעלם מהודעה זו.
            </p>
          </div>
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

      const storedData = otpStore.get(email);
      
      if (!storedData) {
        return new Response(
          JSON.stringify({ error: "קוד אימות לא נמצא או פג תוקף", valid: false }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (storedData.expiresAt < Date.now()) {
        otpStore.delete(email);
        return new Response(
          JSON.stringify({ error: "קוד האימות פג תוקף", valid: false }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (storedData.code !== code) {
        return new Response(
          JSON.stringify({ error: "קוד אימות שגוי", valid: false }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // OTP is valid - remove it from store
      otpStore.delete(email);

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
