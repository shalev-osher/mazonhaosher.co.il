import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting map (in-memory, resets on function restart)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 10;
const WINDOW_MS = 3600000; // 1 hour

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Input validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    emailRegex.test(email) &&
    email.length <= 255 &&
    !email.includes("\n") &&
    !email.includes("\r")
  );
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{9,15}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ""));
}

function validateName(name: string): boolean {
  // Allow Hebrew, English letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[\u0590-\u05FFa-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.length >= 1 && name.length <= 100;
}

interface OrderConfirmationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDetails: string;
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-order-confirmation");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const record = rateLimiter.get(clientIp);

    if (record && record.resetTime > now) {
      if (record.count >= MAX_REQUESTS) {
        console.warn(`Rate limit exceeded for IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      record.count++;
    } else {
      rateLimiter.set(clientIp, { count: 1, resetTime: now + WINDOW_MS });
    }

    // Parse and validate request body
    let body: OrderConfirmationRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { customerName, customerEmail, customerPhone, orderDetails, totalPrice } = body;

    // Validate all inputs
    if (!customerName || !validateName(customerName)) {
      return new Response(
        JSON.stringify({ error: "Invalid customer name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customerEmail || !validateEmail(customerEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customerPhone || !validatePhone(customerPhone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!orderDetails || typeof orderDetails !== "string" || orderDetails.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Invalid order details" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof totalPrice !== "number" || totalPrice <= 0 || totalPrice > 100000) {
      return new Response(
        JSON.stringify({ error: "Invalid total price" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize all user inputs for HTML
    const safeName = escapeHtml(customerName);
    const safePhone = escapeHtml(customerPhone);
    const safeEmail = escapeHtml(customerEmail);
    const safeOrderDetails = escapeHtml(orderDetails);
    const safePrice = Number(totalPrice).toFixed(0);

    console.log("Sending order confirmation email to:", customerEmail);

    const orderDate = new Date().toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const orderNumber = `MH-${Date.now().toString().slice(-6)}`;
    const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png";

    const emailResponse = await resend.emails.send({
      from: "מזון האושר <noreply@mazonhaosher.co.il>",
      to: [customerEmail],
      subject: "אישור הזמנה - מזון האושר",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Heebo', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Glass-like container with transparency -->
            <div style="background: linear-gradient(135deg, rgba(251, 243, 241, 0.85) 0%, rgba(248, 236, 232, 0.75) 100%); border-radius: 24px; padding: 40px 30px; border: 1px solid rgba(232, 93, 143, 0.15);">
              
              <!-- Large Logo -->
              <div style="text-align: center; margin-bottom: 25px;">
                <img src="${logoUrl}" alt="מזון האושר" style="max-width: 180px; height: auto;" />
              </div>
              
              <!-- Title - Just brand name -->
              <h1 style="text-align: center; color: hsl(340, 60%, 55%); font-size: 26px; margin: 0 0 25px 0; font-weight: 600;">מזון האושר</h1>
              
              <!-- Order Number Badge -->
              <div style="text-align: center; margin-bottom: 25px;">
                <span style="background: rgba(232, 93, 143, 0.15); color: hsl(340, 60%, 45%); padding: 8px 20px; border-radius: 20px; font-size: 14px;">
                  הזמנה ${orderNumber} | ${orderDate}
                </span>
              </div>
              
              <!-- Greeting -->
              <p style="font-size: 18px; color: #333; text-align: center; margin: 0 0 20px 0;">שלום ${safeName},</p>
              <p style="color: #666; text-align: center; margin: 0 0 30px 0;">תודה שבחרת בנו! קיבלנו את הזמנתך ונחזור אליך בהקדם.</p>
              
              <!-- Order Details Box -->
              <div style="background: rgba(255, 255, 255, 0.7); border-radius: 16px; padding: 25px; margin-bottom: 20px; border: 1px solid rgba(232, 93, 143, 0.2);">
                <h2 style="color: hsl(340, 60%, 55%); font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">📋 פירוט ההזמנה</h2>
                <pre style="white-space: pre-wrap; font-family: 'Heebo', Arial, sans-serif; margin: 0; font-size: 14px; line-height: 1.8; color: #444;">${safeOrderDetails}</pre>
                <div style="border-top: 1px dashed rgba(232, 93, 143, 0.3); margin-top: 20px; padding-top: 15px;">
                  <table style="width: 100%;">
                    <tr>
                      <td style="font-size: 16px; font-weight: 600; color: hsl(340, 60%, 45%);">סה״כ לתשלום:</td>
                      <td style="font-size: 22px; font-weight: bold; color: hsl(340, 60%, 55%); text-align: left;">₪${safePrice}</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <!-- Customer Info Box -->
              <div style="background: rgba(255, 255, 255, 0.5); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(232, 93, 143, 0.1);">
                <h3 style="margin: 0 0 12px 0; color: hsl(340, 60%, 45%); font-size: 14px; font-weight: 600;">📦 פרטי המזמין</h3>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>שם:</strong> ${safeName}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>טלפון:</strong> ${safePhone}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>מייל:</strong> ${safeEmail}</p>
              </div>
              
              <!-- Payment Notice -->
              <div style="background: rgba(255, 243, 205, 0.6); padding: 15px 20px; border-radius: 12px; border-right: 3px solid hsl(45, 100%, 51%);">
                <p style="margin: 0; font-size: 14px; color: #666;"><strong>💵 אופן תשלום:</strong> מזומן בעת המשלוח</p>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(232, 93, 143, 0.15);">
                <p style="color: #888; margin: 0; font-size: 14px;">בברכה,</p>
                <p style="color: hsl(340, 60%, 55%); font-weight: 600; font-size: 16px; margin: 8px 0 0 0;">מזון האושר</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    // Log full error server-side for debugging
    console.error("Order confirmation error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return generic message to client - never expose internal details
    return new Response(
      JSON.stringify({
        error: "Unable to send order confirmation. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
