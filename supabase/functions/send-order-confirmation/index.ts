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

    const emailResponse = await resend.emails.send({
      from: "Cookie Shop <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "אישור הזמנה - Cookie Shop 🍪",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #B8860B; text-align: center;">🍪 תודה על ההזמנה! 🍪</h1>
          
          <p style="font-size: 18px;">שלום ${customerName},</p>
          
          <p>קיבלנו את הזמנתך ונחזור אליך בהקדם לתיאום משלוח.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">פרטי ההזמנה:</h2>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${orderDetails}</pre>
            <hr style="border: 1px solid #ddd;">
            <p style="font-size: 20px; font-weight: bold; color: #B8860B;">סה״כ לתשלום: ₪${totalPrice}</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📞 טלפון ליצירת קשר:</strong> ${customerPhone}</p>
          </div>
          
          <p>בברכה,<br>צוות Cookie Shop</p>
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
