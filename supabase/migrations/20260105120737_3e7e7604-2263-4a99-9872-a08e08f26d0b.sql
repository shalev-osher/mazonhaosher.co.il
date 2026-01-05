-- Update RPC functions to use auth.uid() for proper authentication

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_profile_by_phone(text);
DROP FUNCTION IF EXISTS public.get_orders_by_phone(text);
DROP FUNCTION IF EXISTS public.get_order_items_by_order(uuid, text);
DROP FUNCTION IF EXISTS public.check_profile_exists(text);

-- Create function to get current user's profile (authenticated only)
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS TABLE(id uuid, phone text, full_name text, address text, city text, notes text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.phone, p.full_name, p.address, p.city, p.notes
  FROM profiles p
  WHERE p.user_id = auth.uid()
  LIMIT 1;
END;
$$;

-- Create function to get current user's orders (authenticated only)
CREATE OR REPLACE FUNCTION public.get_my_orders()
RETURNS TABLE(id uuid, created_at timestamp with time zone, status text, total_amount numeric, full_name text, address text, city text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  RETURN QUERY
  SELECT o.id, o.created_at, o.status, o.total_amount, o.full_name, o.address, o.city
  FROM orders o
  JOIN profiles p ON o.profile_id = p.id
  WHERE p.user_id = auth.uid()
  ORDER BY o.created_at DESC;
END;
$$;

-- Create function to get order items for current user's order (authenticated only)
CREATE OR REPLACE FUNCTION public.get_my_order_items(order_uuid uuid)
RETURNS TABLE(id uuid, cookie_name text, quantity integer, price numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Only return items if the order belongs to the authenticated user
  IF EXISTS (
    SELECT 1 FROM orders o 
    JOIN profiles p ON o.profile_id = p.id 
    WHERE o.id = order_uuid AND p.user_id = auth.uid()
  ) THEN
    RETURN QUERY
    SELECT oi.id, oi.cookie_name, oi.quantity, oi.price
    FROM order_items oi
    WHERE oi.order_id = order_uuid;
  END IF;
END;
$$;

-- Create function to create or update profile for authenticated user
CREATE OR REPLACE FUNCTION public.upsert_my_profile(
  p_phone text,
  p_full_name text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS TABLE(id uuid, phone text, full_name text, address text, city text, notes text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if profile exists for this user
  SELECT p.id INTO profile_id
  FROM profiles p
  WHERE p.user_id = auth.uid();
  
  IF profile_id IS NOT NULL THEN
    -- Update existing profile
    UPDATE profiles
    SET phone = p_phone,
        full_name = COALESCE(p_full_name, profiles.full_name),
        address = COALESCE(p_address, profiles.address),
        city = COALESCE(p_city, profiles.city),
        notes = COALESCE(p_notes, profiles.notes),
        updated_at = now()
    WHERE profiles.id = profile_id;
  ELSE
    -- Create new profile
    INSERT INTO profiles (user_id, phone, full_name, address, city, notes)
    VALUES (auth.uid(), p_phone, p_full_name, p_address, p_city, p_notes)
    RETURNING profiles.id INTO profile_id;
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.phone, p.full_name, p.address, p.city, p.notes
  FROM profiles p
  WHERE p.id = profile_id;
END;
$$;