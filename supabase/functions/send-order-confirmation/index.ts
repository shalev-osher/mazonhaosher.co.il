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

// Generate numeric order number (6 digits)
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return (timestamp.slice(-6) + random).slice(0, 8);
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

    const orderNumber = generateOrderNumber();
    const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png";

    // Customer email - luxurious RTL aligned design
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Heebo', Arial, sans-serif; background-color: #fdf8f6; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
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
            
            <!-- Order Number Badge -->
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="background: linear-gradient(135deg, #e85d8f 0%, #d14d7f 100%); color: white; padding: 14px 32px; border-radius: 30px; font-size: 18px; font-weight: 700; display: inline-block; box-shadow: 0 4px 15px rgba(232, 93, 143, 0.4); letter-spacing: 2px;">
                ${orderNumber}
              </span>
              <p style="font-size: 14px; color: #e85d8f; margin: 15px 0 0 0; font-weight: 600;">מספר הזמנה</p>
              <p style="font-size: 13px; color: #888; margin: 8px 0 0 0;">${orderDate}</p>
            </div>
            
            <!-- Greeting -->
            <div style="text-align: center; margin-bottom: 35px;">
              <p style="font-size: 24px; color: #333; margin: 0 0 15px 0; font-weight: 700;">שלום ${safeName} 🍪</p>
              <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.8;">תודה שבחרת בנו!<br/>קיבלנו את הזמנתך ונחזור אליך בהקדם.</p>
            </div>
            
            <!-- Order Details Box -->
            <div style="background: #fdf8f6; border-radius: 20px; padding: 30px; margin-bottom: 25px; border: 1px solid #f0d5dc; text-align: right;">
              <h2 style="color: #e85d8f; font-size: 18px; margin: 0 0 20px 0; font-weight: 700; text-align: right;">
                📋 פירוט ההזמנה
              </h2>
              <pre style="white-space: pre-wrap; font-family: 'Heebo', Arial, sans-serif; margin: 0; font-size: 15px; line-height: 2.2; color: #444; text-align: right;">${safeOrderDetails}</pre>
              <div style="border-top: 2px dashed #e85d8f; margin-top: 25px; padding-top: 20px;">
                <table style="width: 100%;" dir="rtl">
                  <tr>
                    <td style="font-size: 18px; font-weight: 600; color: #333; text-align: right;">סה״כ לתשלום:</td>
                    <td style="font-size: 28px; font-weight: bold; color: #e85d8f; text-align: left;">₪${safePrice}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- Customer Info Box -->
            <div style="background: #f9f9f9; border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid #eee; text-align: right;">
              <h3 style="margin: 0 0 15px 0; color: #e85d8f; font-size: 16px; font-weight: 700; text-align: right;">
                📦 פרטי המזמין
              </h3>
              <p style="margin: 10px 0; font-size: 15px; color: #555;"><strong>שם:</strong> ${safeName}</p>
              <p style="margin: 10px 0; font-size: 15px; color: #555;"><strong>טלפון:</strong> <span dir="ltr">${safePhone}</span></p>
              <p style="margin: 10px 0; font-size: 15px; color: #555;"><strong>מייל:</strong> <span dir="ltr">${safeEmail}</span></p>
            </div>
            
            <!-- Payment Notice -->
            <div style="background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%); padding: 20px 24px; border-radius: 16px; border-right: 4px solid #f5a623; text-align: right;">
              <p style="margin: 0; font-size: 15px; color: #666;"><strong>💵 אופן תשלום:</strong> מזומן בעת המשלוח</p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #f0d5dc;">
              <p style="color: #888; margin: 0; font-size: 15px;">בברכה,</p>
              <p style="color: #e85d8f; font-weight: 700; font-size: 22px; margin: 12px 0 0 0;">מזון האושר 🍪</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Owner email - different wording for business owner
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Heebo', Arial, sans-serif; background-color: #fdf8f6; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Solid luxurious container -->
          <div style="background: #ffffff; border-radius: 24px; padding: 50px 40px; border: 2px solid #e85d8f; box-shadow: 0 20px 60px rgba(232, 93, 143, 0.15);">
            
            <!-- Large Logo -->
            <div style="text-align: center; margin-bottom: 35px;">
              <img src="${logoUrl}" alt="מזון האושר" style="max-width: 180px; height: auto;" />
            </div>
            
            <!-- Alert Badge -->
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 14px 32px; border-radius: 30px; font-size: 18px; font-weight: 700; display: inline-block; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);">
                🎉 הזמנה חדשה!
              </span>
            </div>
            
            <!-- Order Number -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 28px; color: #333; margin: 0; font-weight: 700; letter-spacing: 2px;">${orderNumber}</p>
              <p style="font-size: 14px; color: #e85d8f; margin: 10px 0 0 0; font-weight: 600;">מספר הזמנה</p>
              <p style="font-size: 13px; color: #888; margin: 8px 0 0 0;">${orderDate}</p>
            </div>
            
            <!-- Customer Info Box - Prominent for owner -->
            <div style="background: linear-gradient(135deg, #e85d8f15 0%, #e85d8f08 100%); border-radius: 20px; padding: 25px; margin-bottom: 25px; border: 2px solid #e85d8f; text-align: right;">
              <h3 style="margin: 0 0 18px 0; color: #e85d8f; font-size: 18px; font-weight: 700; text-align: right;">
                👤 פרטי הלקוח
              </h3>
              <p style="margin: 12px 0; font-size: 16px; color: #333;"><strong>שם:</strong> ${safeName}</p>
              <p style="margin: 12px 0; font-size: 16px; color: #333;"><strong>טלפון:</strong> <a href="tel:${safePhone}" style="color: #e85d8f; text-decoration: none; font-weight: 600;" dir="ltr">${safePhone}</a></p>
              <p style="margin: 12px 0; font-size: 16px; color: #333;"><strong>מייל:</strong> <a href="mailto:${safeEmail}" style="color: #e85d8f; text-decoration: none;" dir="ltr">${safeEmail}</a></p>
            </div>
            
            <!-- Order Details Box -->
            <div style="background: #fdf8f6; border-radius: 20px; padding: 30px; margin-bottom: 25px; border: 1px solid #f0d5dc; text-align: right;">
              <h2 style="color: #e85d8f; font-size: 18px; margin: 0 0 20px 0; font-weight: 700; text-align: right;">
                📋 פירוט ההזמנה
              </h2>
              <pre style="white-space: pre-wrap; font-family: 'Heebo', Arial, sans-serif; margin: 0; font-size: 15px; line-height: 2.2; color: #444; text-align: right;">${safeOrderDetails}</pre>
              <div style="border-top: 2px dashed #e85d8f; margin-top: 25px; padding-top: 20px;">
                <table style="width: 100%;" dir="rtl">
                  <tr>
                    <td style="font-size: 18px; font-weight: 600; color: #333; text-align: right;">סה״כ לגבייה:</td>
                    <td style="font-size: 32px; font-weight: bold; color: #22c55e; text-align: left;">₪${safePrice}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- Action reminder -->
            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px 24px; border-radius: 16px; border-right: 4px solid #3b82f6; text-align: right;">
              <p style="margin: 0; font-size: 15px; color: #1e40af;"><strong>📞 לזכור:</strong> ליצור קשר עם הלקוח לתיאום משלוח</p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #f0d5dc;">
              <p style="color: #888; margin: 0; font-size: 14px;">מייל זה נשלח אוטומטית ממערכת ההזמנות</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send customer email
    const customerEmailResponse = await resend.emails.send({
      from: "מזון האושר <noreply@mazonhaosher.co.il>",
      to: [customerEmail],
      subject: `אישור הזמנה ${orderNumber} - מזון האושר`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent successfully:", customerEmailResponse);

    // Send owner emails
    const ownerEmails = ["almog@mazonhaosher.co.il", "almog21072103@gmail.com"];
    
    const ownerEmailResponse = await resend.emails.send({
      from: "מזון האושר <noreply@mazonhaosher.co.il>",
      to: ownerEmails,
      subject: `🎉 הזמנה חדשה ${orderNumber} - ${safeName}`,
      html: ownerEmailHtml,
    });

    console.log("Owner email sent successfully:", ownerEmailResponse);

    return new Response(JSON.stringify({ success: true, orderNumber }), {
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
