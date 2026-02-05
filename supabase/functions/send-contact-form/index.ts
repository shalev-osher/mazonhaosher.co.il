import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting map
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 3600000; // 1 hour

// HTML escape function
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validation functions
function validateName(name: string): boolean {
  const nameRegex = /^[\u0590-\u05FFa-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9\-\s]{9,15}$/;
  return phoneRegex.test(phone);
}

function validateMessage(message: string): boolean {
  return message.length >= 10 && message.length <= 1000;
}

interface ContactRequest {
  name: string;
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const clientData = rateLimiter.get(clientIP);

    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= MAX_REQUESTS) {
          return new Response(
            JSON.stringify({ error: "יותר מדי בקשות, נסו שוב מאוחר יותר" }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        clientData.count++;
      } else {
        rateLimiter.set(clientIP, { count: 1, resetTime: now + WINDOW_MS });
      }
    } else {
      rateLimiter.set(clientIP, { count: 1, resetTime: now + WINDOW_MS });
    }

    const { name, phone, message }: ContactRequest = await req.json();

    // Validate inputs
    if (!name || !validateName(name)) {
      return new Response(
        JSON.stringify({ error: "שם לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!phone || !validatePhone(phone)) {
      return new Response(
        JSON.stringify({ error: "מספר טלפון לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!message || !validateMessage(message)) {
      return new Response(
        JSON.stringify({ error: "ההודעה חייבת להכיל בין 10 ל-1000 תווים" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeMessage = escapeHtml(message);

    const ownerEmails = ["almog@mazonhaosher.co.il", "almog21072013@gmail.com"];

    const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/email-assets/logo.png";

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f8f5f0; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          
          <!-- Elegant Header with Logo -->
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="${logoUrl}" alt="מזון האושר" style="height: 100px; width: auto;" />
          </div>
          
          <!-- Main Card -->
          <div style="background: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
            
            <!-- Gold Accent Line -->
            <div style="height: 4px; background: linear-gradient(90deg, #d4a574, #c9956c, #d4a574);"></div>
            
            <!-- Header -->
            <div style="padding: 32px 40px 24px; border-bottom: 1px solid #f0ebe3; text-align: center;">
              <h1 style="color: #2c2c2c; margin: 0; font-size: 22px; font-weight: 400; letter-spacing: 1px;">הודעה חדשה מהאתר</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 40px;">
              
              <!-- Sender Info -->
              <div style="margin-bottom: 28px;">
                <h3 style="color: #c9956c; margin: 0 0 16px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">פרטי הפונה</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #888; font-size: 14px; width: 70px; vertical-align: top;">שם:</td>
                    <td style="padding: 10px 0; color: #2c2c2c; font-size: 16px;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #888; font-size: 14px; vertical-align: top;">טלפון:</td>
                    <td style="padding: 10px 0;"><a href="tel:${safePhone}" style="color: #c9956c; text-decoration: none; font-size: 16px;">${safePhone}</a></td>
                  </tr>
                </table>
              </div>
              
              <!-- Divider -->
              <div style="height: 1px; background: #f0ebe3; margin: 24px 0;"></div>
              
              <!-- Message -->
              <div>
                <h3 style="color: #c9956c; margin: 0 0 16px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">תוכן ההודעה</h3>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.9; color: #444; font-size: 15px; background: #faf8f5; padding: 20px; border-radius: 4px; border-right: 3px solid #d4a574;">${safeMessage}</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #faf8f5; padding: 24px 40px; text-align: center; border-top: 1px solid #f0ebe3;">
              <p style="color: #999; margin: 0; font-size: 12px; letter-spacing: 1px;">מזון האושר · עוגיות בוטיק</p>
              <p style="color: #c9956c; margin: 8px 0 0 0; font-size: 11px;">✦</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "מזון האושר <noreply@mazonhaosher.co.il>",
      to: ownerEmails,
      subject: `📬 הודעה חדשה מ${safeName}`,
      html: emailHtml,
    });

    console.log("Contact form email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-contact-form:", error);
    return new Response(
      JSON.stringify({ error: "שגיאה בשליחת ההודעה" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
