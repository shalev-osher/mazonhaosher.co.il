import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting map (in-memory, resets on function restart)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 5; // 5 requests per hour
const WINDOW_MS = 3600000; // 1 hour

// Input validation
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
  // Israeli phone format
  const phoneRegex = /^0(5[0-9]|7[0-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
}

interface SubscribeRequest {
  email?: string;
  phone?: string;
}

// Generate unsubscribe token (base64 encoded email)
function generateUnsubscribeToken(email: string): string {
  return btoa(email);
}

// Send welcome email to new subscriber
async function sendWelcomeEmail(email: string): Promise<void> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured, skipping welcome email");
    return;
  }

  const resend = new Resend(resendApiKey);
  const logoUrl = "https://ffhnameizeueevuqvjfi.supabase.co/storage/v1/object/public/assets/logo.png";
  const unsubscribeToken = generateUnsubscribeToken(email);
  // Link to a page on the site (more reliably rendered across email clients)
  const siteUrl = "https://mazonhaosher.lovable.app";
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

  try {
    await resend.emails.send({
      from: "מזון האושר <noreply@mazonhaosher.co.il>",
      to: [email],
      subject: "ברוכים הבאים למשפחת מזון האושר! 🍪",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Heebo', Arial, sans-serif; background-color: #fef7f0; direction: rtl;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
                  
                  <!-- Logo Section -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <img src="${logoUrl}" alt="מזון האושר" style="max-width: 180px; height: auto;" />
                    </td>
                  </tr>
                  
                  <!-- Main Content Card -->
                  <tr>
                    <td>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 3px solid #e85d8f;">
                        
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #e85d8f 0%, #f472b6 100%); padding: 30px 40px; border-radius: 17px 17px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                              תודה שנרשמת! 🎉
                            </h1>
                          </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                          <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 18px; line-height: 1.8; text-align: center;">
                              שמחים לבשר שהצטרפת לרשימת התפוצה שלנו! 💖
                            </p>
                            
                            <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 16px; line-height: 1.8; text-align: center;">
                              מעכשיו תהיו הראשונים לשמוע על:
                            </p>
                            
                            <!-- Benefits List -->
                            <table role="presentation" style="width: 100%; margin: 0 0 30px 0;">
                              <tr>
                                <td align="center">
                                  <table role="presentation" style="border-collapse: collapse;">
                                    <tr>
                                      <td style="padding: 10px 20px; background-color: #fef3c7; border-radius: 10px; margin-bottom: 10px;">
                                        <span style="color: #92400e; font-size: 15px;">🍪 עוגיות חדשות וטעמים מפתיעים</span>
                                      </td>
                                    </tr>
                                    <tr><td style="height: 10px;"></td></tr>
                                    <tr>
                                      <td style="padding: 10px 20px; background-color: #dbeafe; border-radius: 10px;">
                                        <span style="color: #1e40af; font-size: 15px;">🎁 מבצעים והנחות בלעדיות</span>
                                      </td>
                                    </tr>
                                    <tr><td style="height: 10px;"></td></tr>
                                    <tr>
                                      <td style="padding: 10px 20px; background-color: #dcfce7; border-radius: 10px;">
                                        <span style="color: #166534; font-size: 15px;">✨ עדכונים ואירועים מיוחדים</span>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.8; text-align: center;">
                              נתראה בקרוב! 🥰
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #fdf2f8; padding: 25px 40px; border-radius: 0 0 17px 17px; text-align: center;">
                            <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                              מזון האושר - עוגיות שמביאות אושר 💝
                            </p>
                          </td>
                        </tr>
                        
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Unsubscribe Link -->
                  <tr>
                    <td align="center" style="padding-top: 30px;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        לא מעוניינים לקבל עדכונים? 
                        <a href="${unsubscribeUrl}" style="color: #e85d8f; text-decoration: underline;">לחצו כאן להסרה מהרשימה</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log("Welcome email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw - subscription should succeed even if email fails
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received newsletter subscription request");

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
        console.warn(`Rate limit exceeded for newsletter subscription from IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: "יותר מדי בקשות. נסו שוב מאוחר יותר." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      record.count++;
    } else {
      rateLimiter.set(clientIp, { count: 1, resetTime: now + WINDOW_MS });
    }

    // Parse request body
    let body: SubscribeRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, phone } = body;

    // At least one must be provided
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ error: "נא להזין מייל או טלפון" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email if provided
    if (email && !validateEmail(email.trim())) {
      return new Response(
        JSON.stringify({ error: "כתובת מייל לא תקינה" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone.trim())) {
      return new Response(
        JSON.stringify({ error: "מספר טלפון לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for insert
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert subscription
    const { error: insertError } = await supabase
      .from("newsletter_subscriptions")
      .insert({
        email: email?.trim() || null,
        phone: phone?.trim() || null,
      });

    if (insertError) {
      // Don't reveal if email/phone already exists (prevent enumeration)
      if (insertError.code === "23505") {
        console.log("Duplicate newsletter subscription attempt");
        // Return success to prevent enumeration
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Error inserting newsletter subscription:", insertError);
      throw insertError;
    }

    console.log("Newsletter subscription successful");

    // Send welcome email if email was provided
    if (email) {
      await sendWelcomeEmail(email.trim());
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ error: "אירעה שגיאה, נסו שוב מאוחר יותר" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
