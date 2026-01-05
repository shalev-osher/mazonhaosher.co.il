-- Fix security issues for profiles, orders, and order_items tables

-- 1. Create a secure RPC function for phone lookup (returns only boolean, not data)
CREATE OR REPLACE FUNCTION public.check_profile_exists(phone_number TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM profiles WHERE phone = phone_number);
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.check_profile_exists(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_profile_exists(TEXT) TO authenticated;

-- 2. Create RPC function to get profile by phone (returns profile data for the matching phone)
CREATE OR REPLACE FUNCTION public.get_profile_by_phone(phone_number TEXT)
RETURNS TABLE (
  id UUID,
  phone TEXT,
  full_name TEXT,
  address TEXT,
  city TEXT,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.phone, p.full_name, p.address, p.city, p.notes
  FROM profiles p
  WHERE p.phone = phone_number
  LIMIT 1;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_profile_by_phone(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_profile_by_phone(TEXT) TO authenticated;

-- 3. Create RPC function to get orders by phone
CREATE OR REPLACE FUNCTION public.get_orders_by_phone(phone_number TEXT)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  status TEXT,
  total_amount NUMERIC,
  full_name TEXT,
  address TEXT,
  city TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.created_at, o.status, o.total_amount, o.full_name, o.address, o.city
  FROM orders o
  WHERE o.phone = phone_number
  ORDER BY o.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_orders_by_phone(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_orders_by_phone(TEXT) TO authenticated;

-- 4. Create RPC function to get order items by order ID (only if order belongs to the phone)
CREATE OR REPLACE FUNCTION public.get_order_items_by_order(order_uuid UUID, phone_number TEXT)
RETURNS TABLE (
  id UUID,
  cookie_name TEXT,
  quantity INTEGER,
  price NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return items if the order belongs to the phone number
  IF EXISTS (SELECT 1 FROM orders WHERE orders.id = order_uuid AND orders.phone = phone_number) THEN
    RETURN QUERY
    SELECT oi.id, oi.cookie_name, oi.quantity, oi.price
    FROM order_items oi
    WHERE oi.order_id = order_uuid;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_order_items_by_order(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_order_items_by_order(UUID, TEXT) TO authenticated;

-- 5. Drop overly permissive policies
DROP POLICY IF EXISTS "Profile lookup by phone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;

-- 6. Create restrictive SELECT policies (deny by default for anonymous users)
-- Profiles: Only authenticated users can see their own profile via user_id
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Orders: Only authenticated users can see their own orders via profile's user_id
CREATE POLICY "Authenticated users can view own orders"
ON public.orders FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Order items: Only for orders belonging to authenticated user
CREATE POLICY "Authenticated users can view own order items"
ON public.order_items FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  order_id IN (
    SELECT o.id FROM orders o 
    JOIN profiles p ON o.profile_id = p.id 
    WHERE p.user_id = auth.uid()
  )
);