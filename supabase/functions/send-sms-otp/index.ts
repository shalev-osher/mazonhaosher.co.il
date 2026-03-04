import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const phoneRegex = /^[\d\+\-\(\)\s]{7,20}$/;
const RATE_LIMIT_WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 3;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone || typeof phone !== "string" || !phoneRegex.test(phone)) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedPhone = phone.trim();

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Rate limiting
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await serviceClient
      .from("sms_otp_tokens")
      .select("*", { count: "exact", head: true })
      .eq("phone", sanitizedPhone)
      .gte("created_at", windowStart);

    if ((count ?? 0) >= MAX_ATTEMPTS) {
      return new Response(JSON.stringify({ error: "Too many attempts. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Hash the OTP
    const encoder = new TextEncoder();
    const data = encoder.encode(otp);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const codeHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await serviceClient.from("sms_otp_tokens").insert({
      phone: sanitizedPhone,
      code_hash: codeHash,
      expires_at: expiresAt,
      verified: false,
    });

    // Send SMS via Vonage
    const vonageKey = Deno.env.get("VONAGE_API_KEY");
    const vonageSecret = Deno.env.get("VONAGE_API_SECRET");

    if (vonageKey && vonageSecret) {
      await fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: vonageKey,
          api_secret: vonageSecret,
          to: sanitizedPhone.replace(/[^\d+]/g, ""),
          from: "MazonHaosher",
          text: `קוד האימות שלך: ${otp}`,
        }),
      });
    }

    // Cleanup expired tokens
    await serviceClient.rpc("cleanup_expired_sms_otp_tokens");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
