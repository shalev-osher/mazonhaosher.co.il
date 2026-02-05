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
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="מזון האושר" style="height: 80px; width: auto;" />
          </div>
          
          <!-- Main Card -->
          <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); border: 3px solid #e85d8f;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #e85d8f, #d4447a); padding: 24px; text-align: right;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">📬 הודעה חדשה מהאתר</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 28px; text-align: right;">
              <div style="background-color: #fdf2f8; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-right: 4px solid #e85d8f;">
                <h3 style="color: #be185d; margin: 0 0 16px 0; font-size: 16px;">פרטי השולח</h3>
                <p style="margin: 10px 0; color: #374151; font-size: 15px;"><strong style="color: #1f2937;">שם:</strong> ${safeName}</p>
                <p style="margin: 10px 0; color: #374151; font-size: 15px;"><strong style="color: #1f2937;">טלפון:</strong> <a href="tel:${safePhone}" style="color: #e85d8f; text-decoration: none; font-weight: 500;">${safePhone}</a></p>
              </div>
              
              <div style="background-color: #fffbeb; border-radius: 12px; padding: 20px; border-right: 4px solid #f59e0b;">
                <h3 style="color: #b45309; margin: 0 0 16px 0; font-size: 16px;">ההודעה</h3>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.7; color: #374151; font-size: 15px;">${safeMessage}</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #fdf2f8; padding: 18px; text-align: center; border-top: 1px solid #fce7f3;">
              <p style="color: #9d174d; margin: 0; font-size: 14px; font-weight: 500;">מזון האושר 🍪 עוגיות בוטיק</p>
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
