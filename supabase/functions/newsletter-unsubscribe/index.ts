import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Simple base64 encode/decode for email token
function decodeToken(token: string): string | null {
  try {
    return atob(token);
  } catch {
    return null;
  }
}

// Helper to create HTML response with proper headers
function htmlResponse(html: string, status: number = 200): Response {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function jsonResponse(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

const SITE_URL = "https://mazonhaosher.lovable.app";

type ResultStatus = "unsubscribed" | "resubscribed" | "info" | "error";

function redirectToSite(params: {
  result: ResultStatus;
  token?: string | null;
  action?: string | null;
}): Response {
  const url = new URL("/newsletter/unsubscribe", SITE_URL);
  url.searchParams.set("result", params.result);
  if (params.token) url.searchParams.set("token", params.token);
  if (params.action) url.searchParams.set("action", params.action);
  // 303 is safest after potential state change
  return Response.redirect(url.toString(), 303);
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received newsletter request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const action = url.searchParams.get("action") || "unsubscribe";
    const wantsJson =
      url.searchParams.get("format") === "json" ||
      (req.headers.get("accept") || "").includes("application/json");

    if (!token) {
      if (wantsJson) {
        return jsonResponse(
          { result: "error", title: "שגיאה", message: "קישור לא תקין. נא לנסות שוב." },
          400,
        );
      }
      return redirectToSite({ result: "error", action });
    }

    const email = decodeToken(token);
    if (!email || !email.includes("@")) {
      if (wantsJson) {
        return jsonResponse(
          { result: "error", title: "שגיאה", message: "קישור לא תקין. נא לנסות שוב." },
          400,
        );
      }
      return redirectToSite({ result: "error", action });
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "resubscribe") {
      // Re-subscribe: update is_active to true
      const { error: updateError, data } = await supabase
        .from("newsletter_subscriptions")
        .update({ is_active: true })
        .eq("email", email)
        .eq("is_active", false)
        .select();

      if (updateError) {
        console.error("Error re-subscribing:", updateError);
        if (wantsJson) {
          return jsonResponse(
            { result: "error", title: "שגיאה", message: "אירעה שגיאה. נא לנסות שוב מאוחר יותר." },
            500,
          );
        }
        return redirectToSite({ result: "error", token, action });
      }

      if (!data || data.length === 0) {
        console.log("Email not found or already subscribed:", email);
        if (wantsJson) {
          return jsonResponse({
            result: "info",
            title: "כבר רשום/ה",
            message: "כתובת המייל שלך כבר רשומה לניוזלטר! 🎉",
          });
        }
        return redirectToSite({ result: "info", token, action });
      }

      console.log("Successfully re-subscribed:", email);
      if (wantsJson) {
        return jsonResponse({
          result: "resubscribed",
          title: "נרשמת מחדש!",
          message: "ברוכים השבים! תודה שחזרת אלינו 💖",
        });
      }
      return redirectToSite({ result: "resubscribed", token, action });
    }

    // Default: Unsubscribe
    const { error: updateError, data } = await supabase
      .from("newsletter_subscriptions")
      .update({ is_active: false })
      .eq("email", email)
      .eq("is_active", true)
      .select();

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      if (wantsJson) {
        return jsonResponse(
          { result: "error", title: "שגיאה", message: "אירעה שגיאה. נא לנסות שוב מאוחר יותר." },
          500,
        );
      }
      return redirectToSite({ result: "error", token, action });
    }

    if (!data || data.length === 0) {
      console.log("Email not found or already unsubscribed:", email);
    } else {
      console.log("Successfully unsubscribed:", email);
    }

    if (wantsJson) {
      return jsonResponse({
        result: "unsubscribed",
        title: "הוסרת בהצלחה",
        message: "הוסרת מרשימת התפוצה שלנו. נשמח לראותך שוב בעתיד! 💖",
        token,
      });
    }
    return redirectToSite({ result: "unsubscribed", token, action });
  } catch (error: unknown) {
    console.error("Newsletter action error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    const url = new URL(req.url);
    const wantsJson =
      url.searchParams.get("format") === "json" ||
      (req.headers.get("accept") || "").includes("application/json");

    if (wantsJson) {
      return jsonResponse(
        { result: "error", title: "שגיאה", message: "אירעה שגיאה. נא לנסות שוב מאוחר יותר." },
        500,
      );
    }

    return redirectToSite({ result: "error" });
  }
};

function getHtmlPage(title: string, message: string, status: "unsubscribed" | "resubscribed" | "info" | "error", token: string | null): string {
  const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png";
  
  let iconColor = "#10b981";
  let icon = "✓";
  
  if (status === "error") {
    iconColor = "#ef4444";
    icon = "✕";
  } else if (status === "info") {
    iconColor = "#3b82f6";
    icon = "ℹ";
  } else if (status === "resubscribed") {
    iconColor = "#10b981";
    icon = "♥";
  }
  
  // Show re-subscribe button only after successful unsubscribe
  const resubscribeButton = status === "unsubscribed" && token
    ? `<a href="?token=${encodeURIComponent(token)}&action=resubscribe" class="resubscribe-link">להירשם מחדש</a>`
    : "";

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - מזון האושר</title>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&display=swap" rel="stylesheet">
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
      border: 3px solid #f59e0b;
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
      background: #fffbeb;
      padding: 20px;
      color: #9ca3af;
      font-size: 14px;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      margin-top: 24px;
    }
    .home-link {
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
    .resubscribe-link {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      text-decoration: none;
      padding: 12px 32px;
      border-radius: 50px;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .resubscribe-link:hover {
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
      <div class="buttons">
        ${resubscribeButton}
        <a href="https://mazonhaosher.lovable.app" class="home-link">חזרה לאתר</a>
      </div>
    </div>
    <div class="footer">
      מזון האושר - עוגיות שמביאות אושר 💝
    </div>
  </div>
</body>
</html>`;
}

serve(handler);