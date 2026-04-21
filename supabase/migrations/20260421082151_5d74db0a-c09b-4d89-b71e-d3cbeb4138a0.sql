-- 1. Newsletter: explicit deny INSERT from client (only service role can insert via edge function)
DROP POLICY IF EXISTS "No public insert to newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "No public insert to newsletter subscriptions"
ON public.newsletter_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- 2. Order items: remove guest insert escalation, require authentication
DROP POLICY IF EXISTS "Authenticated users can create order items for own orders" ON public.order_items;
CREATE POLICY "Authenticated users can create order items for own orders"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  order_id IN (
    SELECT o.id
    FROM orders o
    JOIN profiles p ON o.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- 3. Storage assets bucket: restrict listing, allow direct access only
DROP POLICY IF EXISTS "Public can list assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view assets" ON storage.objects;

CREATE POLICY "Public read individual assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'assets' AND (storage.foldername(name))[1] IS NOT NULL);