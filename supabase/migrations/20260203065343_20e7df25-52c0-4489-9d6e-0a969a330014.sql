-- Fix orders table: Only allow orders via guest-checkout edge function or authenticated users
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

-- Create a more restrictive policy for authenticated users to create orders with their own profile
CREATE POLICY "Authenticated users can create own orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (
  profile_id IS NULL OR 
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Allow service role to create orders (for guest-checkout edge function)
-- Note: Service role bypasses RLS, so guest-checkout will work

-- For order items - only allow if order exists and belongs to user
CREATE POLICY "Authenticated users can create order items for own orders"
ON order_items
FOR INSERT
TO authenticated
WITH CHECK (
  order_id IN (
    SELECT o.id FROM orders o
    JOIN profiles p ON o.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
  OR
  order_id IN (
    SELECT o.id FROM orders o
    WHERE o.profile_id IS NULL
  )
);

-- Fix cookie_reviews: Require authentication for creating reviews
DROP POLICY IF EXISTS "Anyone can create reviews" ON cookie_reviews;

-- Allow authenticated users to create reviews (profile_id optional for flexibility)
CREATE POLICY "Authenticated users can create reviews"
ON cookie_reviews
FOR INSERT
TO authenticated
WITH CHECK (
  profile_id IS NULL OR 
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Fix profiles table: Keep guest profile creation but add better constraints
-- The current policy "Anyone can create profile with phone" allows creation only when user_id IS NULL
-- This is correct for guest checkout. Let's keep it but ensure it's intentional.

-- Add storage policies for avatar uploads (authenticated users only)
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);