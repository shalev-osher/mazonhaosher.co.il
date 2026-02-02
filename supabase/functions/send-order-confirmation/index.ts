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

    const emailResponse = await resend.emails.send({
      from: "מזון האושר <noreply@send.mazonhaosher.co.il>",
      to: [customerEmail],
      subject: "קבלה והאישור הזמנה - מזון האושר 🍪",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fefefe;">
          <!-- Header with Logo -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #B8860B;">
            <h1 style="color: #B8860B; margin: 10px 0 0 0; font-size: 28px;">מזון האושר</h1>
            <p style="color: #666; margin: 5px 0 0 0;">עוגיות אמריקאיות ביתיות</p>
          </div>
          
          <!-- Receipt Header -->
          <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td><strong>מספר הזמנה:</strong> ${orderNumber}</td>
                <td style="text-align: left;"><strong>תאריך:</strong> ${orderDate}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 18px; color: #333;">שלום ${safeName},</p>
          <p style="color: #555;">תודה שבחרת במזון האושר! קיבלנו את הזמנתך ונחזור אליך בהקדם לתיאום משלוח.</p>
          
          <!-- Order Details - Receipt Style -->
          <div style="border: 2px solid #B8860B; border-radius: 10px; overflow: hidden; margin: 20px 0;">
            <div style="background-color: #B8860B; color: white; padding: 12px 20px;">
              <h2 style="margin: 0; font-size: 18px;">📋 פירוט ההזמנה</h2>
            </div>
            <div style="padding: 20px; background-color: #fffef5;">
              <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0; font-size: 15px; line-height: 1.8;">${safeOrderDetails}</pre>
            </div>
            <div style="border-top: 2px dashed #B8860B; padding: 15px 20px; background-color: #fff8e7;">
              <table style="width: 100%;">
                <tr>
                  <td style="font-size: 20px; font-weight: bold; color: #B8860B;">סה״כ לתשלום:</td>
                  <td style="font-size: 24px; font-weight: bold; color: #B8860B; text-align: left;">₪${safePrice}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Customer Info -->
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #2e7d32;">📦 פרטי המזמין</h3>
            <p style="margin: 5px 0;"><strong>שם:</strong> ${safeName}</p>
            <p style="margin: 5px 0;"><strong>טלפון:</strong> ${safePhone}</p>
            <p style="margin: 5px 0;"><strong>מייל:</strong> ${safeEmail}</p>
          </div>
          
          <!-- Payment Notice -->
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #ffc107;">
            <p style="margin: 0;"><strong>💵 אופן תשלום:</strong> מזומן בעת המשלוח</p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="color: #666; margin: 0;">בברכה,</p>
            <p style="color: #B8860B; font-weight: bold; font-size: 18px; margin: 5px 0;">מזון האושר</p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">עוגיות אמריקאיות ביתיות מוכנות באהבה 🍪</p>
          </div>
        </div>
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
