import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    const { customerName, customerEmail, customerPhone, orderDetails, totalPrice }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation email to:", customerEmail);
    console.log("Order details:", orderDetails);

    const orderDate = new Date().toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const orderNumber = `MH-${Date.now().toString().slice(-6)}`;

    const emailResponse = await resend.emails.send({
      from: "מזון האושר <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "קבלה והאישור הזמנה - מזון האושר 🍪",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fefefe;">
          <!-- Header with Logo -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #B8860B;">
            <img src="https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png" alt="מזון האושר" style="max-width: 150px; height: auto;" />
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
          
          <p style="font-size: 18px; color: #333;">שלום ${customerName},</p>
          <p style="color: #555;">תודה שבחרת במזון האושר! קיבלנו את הזמנתך ונחזור אליך בהקדם לתיאום משלוח.</p>
          
          <!-- Order Details - Receipt Style -->
          <div style="border: 2px solid #B8860B; border-radius: 10px; overflow: hidden; margin: 20px 0;">
            <div style="background-color: #B8860B; color: white; padding: 12px 20px;">
              <h2 style="margin: 0; font-size: 18px;">📋 פירוט ההזמנה</h2>
            </div>
            <div style="padding: 20px; background-color: #fffef5;">
              <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0; font-size: 15px; line-height: 1.8;">${orderDetails}</pre>
            </div>
            <div style="border-top: 2px dashed #B8860B; padding: 15px 20px; background-color: #fff8e7;">
              <table style="width: 100%;">
                <tr>
                  <td style="font-size: 20px; font-weight: bold; color: #B8860B;">סה״כ לתשלום:</td>
                  <td style="font-size: 24px; font-weight: bold; color: #B8860B; text-align: left;">₪${totalPrice}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Customer Info -->
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #2e7d32;">📦 פרטי המזמין</h3>
            <p style="margin: 5px 0;"><strong>שם:</strong> ${customerName}</p>
            <p style="margin: 5px 0;"><strong>טלפון:</strong> ${customerPhone}</p>
            <p style="margin: 5px 0;"><strong>מייל:</strong> ${customerEmail}</p>
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

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
