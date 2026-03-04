import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\+\-\(\)\s]{7,20}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, phone } = body;

    // Validate at least one contact method
    if (!email && !phone) {
      return new Response(JSON.stringify({ error: "Email or phone required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (email && (typeof email !== "string" || !emailRegex.test(email) || email.length > 255)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (phone && (typeof phone !== "string" || !phoneRegex.test(phone))) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check for existing subscription
    let query = serviceClient.from("newsletter_subscriptions").select("id, is_active");
    if (email) query = query.eq("email", email.toLowerCase().trim());
    else query = query.eq("phone", phone.trim());

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      if (existing.is_active) {
        return new Response(JSON.stringify({ success: true, message: "Already subscribed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Reactivate
      await serviceClient
        .from("newsletter_subscriptions")
        .update({ is_active: true })
        .eq("id", existing.id);
    } else {
      await serviceClient.from("newsletter_subscriptions").insert({
        email: email ? email.toLowerCase().trim() : null,
        phone: phone ? phone.trim() : null,
        is_active: true,
      });
    }

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
