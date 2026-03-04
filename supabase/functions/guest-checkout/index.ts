import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const phoneRegex = /^[\d\+\-\(\)\s]{7,20}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { fullName, phone, address, city, notes, items, totalAmount } = body;

    // Input validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2 || fullName.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!phone || typeof phone !== "string" || !phoneRegex.test(phone)) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!address || typeof address !== "string" || address.trim().length < 2 || address.length > 500) {
      return new Response(JSON.stringify({ error: "Invalid address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!city || typeof city !== "string" || city.trim().length < 2 || city.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid city" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid items" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0 || totalAmount > 100000) {
      return new Response(JSON.stringify({ error: "Invalid total" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.cookie_name || typeof item.cookie_name !== "string" || item.cookie_name.length > 100) {
        return new Response(JSON.stringify({ error: "Invalid item name" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        return new Response(JSON.stringify({ error: "Invalid quantity" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof item.price !== "number" || item.price <= 0 || item.price > 10000) {
        return new Response(JSON.stringify({ error: "Invalid price" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create or find guest profile
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("id")
      .eq("phone", phone.trim())
      .is("user_id", null)
      .maybeSingle();

    let profileId: string;
    if (profile) {
      profileId = profile.id;
      await serviceClient
        .from("profiles")
        .update({ full_name: fullName.trim(), address: address.trim(), city: city.trim() })
        .eq("id", profileId);
    } else {
      const { data: newProfile, error: profileErr } = await serviceClient
        .from("profiles")
        .insert({
          phone: phone.trim(),
          full_name: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
        })
        .select("id")
        .single();

      if (profileErr || !newProfile) {
        return new Response(JSON.stringify({ error: "Failed to create profile" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      profileId = newProfile.id;
    }

    // Create order
    const { data: order, error: orderErr } = await serviceClient
      .from("orders")
      .insert({
        profile_id: profileId,
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes ? String(notes).slice(0, 500) : null,
        total_amount: totalAmount,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      cookie_name: String(item.cookie_name).slice(0, 100),
      quantity: item.quantity,
      price: item.price,
    }));

    await serviceClient.from("order_items").insert(orderItems);

    return new Response(JSON.stringify({ success: true, orderId: order.id }), {
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
