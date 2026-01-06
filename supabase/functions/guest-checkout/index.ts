import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting map (in-memory, resets on function restart)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const MAX_ORDERS = 10; // 10 orders per hour per IP
const WINDOW_MS = 3600000; // 1 hour

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
  // Israeli phone format
  const phoneRegex = /^0(5[0-9]|7[0-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
}

function validateName(name: string): boolean {
  // Allow Hebrew, English letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[\u0590-\u05FFa-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
}

function validateAddress(address: string): boolean {
  return address.length >= 3 && address.length <= 200;
}

function validateCity(city: string): boolean {
  return city.length >= 2 && city.length <= 50;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received guest checkout request");

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
      if (record.count >= MAX_ORDERS) {
        console.warn(`Rate limit exceeded for guest checkout from IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: "יותר מדי הזמנות. נסו שוב מאוחר יותר." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      record.count++;
    } else {
      rateLimiter.set(clientIp, { count: 1, resetTime: now + WINDOW_MS });
    }

    // Parse request body
    let body: CheckoutRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { fullName, email, phone, address, city, notes, items, totalPrice } = body;

    // Validate all inputs
    if (!fullName || !validateName(fullName.trim())) {
      return new Response(
        JSON.stringify({ error: "שם מלא לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || !validateEmail(email.trim())) {
      return new Response(
        JSON.stringify({ error: "כתובת מייל לא תקינה" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!phone || !validatePhone(phone.trim())) {
      return new Response(
        JSON.stringify({ error: "מספר טלפון לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!address || !validateAddress(address.trim())) {
      return new Response(
        JSON.stringify({ error: "כתובת לא תקינה" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!city || !validateCity(city.trim())) {
      return new Response(
        JSON.stringify({ error: "עיר לא תקינה" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (notes && notes.length > 500) {
      return new Response(
        JSON.stringify({ error: "הערות ארוכות מדי" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return new Response(
        JSON.stringify({ error: "רשימת מוצרים לא תקינה" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof totalPrice !== "number" || totalPrice <= 0 || totalPrice > 100000) {
      return new Response(
        JSON.stringify({ error: "סכום לא תקין" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || typeof item.name !== "string" || item.name.length > 100) {
        return new Response(
          JSON.stringify({ error: "שם מוצר לא תקין" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 100) {
        return new Response(
          JSON.stringify({ error: "כמות לא תקינה" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (typeof item.price !== "number" || item.price <= 0 || item.price > 10000) {
        return new Response(
          JSON.stringify({ error: "מחיר לא תקין" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create guest profile
    let profileId: string | undefined;
    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        phone: phone.trim(),
        full_name: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes?.trim() || null,
        user_id: null, // Guest profile
      })
      .select("id")
      .single();

    if (profileError) {
      // If duplicate phone, try to find existing profile
      if (profileError.code === "23505") {
        console.log("Profile with this phone exists, using existing");
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("phone", phone.trim())
          .is("user_id", null)
          .single();
        
        if (existingProfile) {
          profileId = existingProfile.id;
        }
      } else {
        console.error("Error creating profile:", profileError);
      }
    } else if (newProfile) {
      profileId = newProfile.id;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        profile_id: profileId,
        phone: phone.trim(),
        full_name: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes?.trim() || null,
        total_amount: totalPrice,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    // Create order items
    if (order) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        cookie_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Don't throw - order was created
      }
    }

    console.log("Guest checkout successful, order ID:", order?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order?.id,
        profileId 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Guest checkout error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ error: "שגיאה בשליחת ההזמנה, נסו שוב" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
