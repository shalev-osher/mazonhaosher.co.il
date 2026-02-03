import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple base64 encode/decode for email token
function decodeToken(token: string): string | null {
  try {
    return atob(token);
  } catch {
    return null;
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received newsletter unsubscribe request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        getHtmlPage("שגיאה", "קישור לא תקין. נא לנסות שוב.", false),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const email = decodeToken(token);
    if (!email || !email.includes("@")) {
      return new Response(
        getHtmlPage("שגיאה", "קישור לא תקין. נא לנסות שוב.", false),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update subscription to inactive
    const { error: updateError, data } = await supabase
      .from("newsletter_subscriptions")
      .update({ is_active: false })
      .eq("email", email)
      .eq("is_active", true)
      .select();

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return new Response(
        getHtmlPage("שגיאה", "אירעה שגיאה. נא לנסות שוב מאוחר יותר.", false),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (!data || data.length === 0) {
      // Email not found or already unsubscribed - show success anyway to prevent enumeration
      console.log("Email not found or already unsubscribed:", email);
    } else {
      console.log("Successfully unsubscribed:", email);
    }

    return new Response(
      getHtmlPage("הוסרת בהצלחה", "הוסרת מרשימת התפוצה שלנו. נשמח לראותך שוב בעתיד! 💖", true),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error: unknown) {
    console.error("Unsubscribe error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    return new Response(
      getHtmlPage("שגיאה", "אירעה שגיאה. נא לנסות שוב מאוחר יותר.", false),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  }
};

function getHtmlPage(title: string, message: string, success: boolean): string {
  const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png";
  const iconColor = success ? "#10b981" : "#ef4444";
  const icon = success ? "✓" : "✕";

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - מזון האושר</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Heebo', Arial, sans-serif;
          background: linear-gradient(135deg, #fef7f0 0%, #fdf2f8 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          direction: rtl;
        }
        .container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          max-width: 500px;
          width: 100%;
          text-align: center;
          overflow: hidden;
          border: 3px solid #e85d8f;
        }
        .logo-section {
          padding: 30px 20px 20px;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${iconColor};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 40px;
          color: white;
        }
        .content {
          padding: 20px 40px 40px;
        }
        h1 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 16px;
        }
        p {
          color: #6b7280;
          font-size: 18px;
          line-height: 1.6;
        }
        .footer {
          background: #fdf2f8;
          padding: 20px;
          color: #9ca3af;
          font-size: 14px;
        }
        .home-link {
          display: inline-block;
          margin-top: 24px;
          background: linear-gradient(135deg, #e85d8f 0%, #f472b6 100%);
          color: white;
          text-decoration: none;
          padding: 12px 32px;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .home-link:hover {
          transform: scale(1.05);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="${logoUrl}" alt="מזון האושר" class="logo" />
        </div>
        <div class="content">
          <div class="icon-circle">${icon}</div>
          <h1>${title}</h1>
          <p>${message}</p>
          <a href="https://mazonhaosher.co.il" class="home-link">חזרה לאתר</a>
        </div>
        <div class="footer">
          מזון האושר - עוגיות שמביאות אושר 💝
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
