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

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📬 הודעה חדשה מהאתר</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #059669; margin: 0 0 15px 0;">פרטי השולח</h3>
              <p style="margin: 8px 0;"><strong>שם:</strong> ${safeName}</p>
              <p style="margin: 8px 0;"><strong>טלפון:</strong> <a href="tel:${safePhone}" style="color: #059669;">${safePhone}</a></p>
            </div>
            
            <div style="background-color: #fefce8; border-radius: 8px; padding: 20px;">
              <h3 style="color: #ca8a04; margin: 0 0 15px 0;">ההודעה</h3>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">מזון האושר 🍪</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "מזון האושר <noreply@mazonhaosher.lovable.app>",
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
