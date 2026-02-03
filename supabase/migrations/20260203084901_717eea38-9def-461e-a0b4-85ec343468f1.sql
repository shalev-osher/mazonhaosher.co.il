-- Fix 1: Block public SELECT access to orders table (ERROR level)
-- Only authenticated users should view their own orders
CREATE POLICY "No public read access to orders" 
ON public.orders 
FOR SELECT 
TO anon
USING (false);

-- Fix 2: Block public SELECT access to profiles table (ERROR level)
-- Only authenticated users should view their own profile
CREATE POLICY "No public read access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);

-- Fix 3: Fix the conflicting order_items policy (WARN level)
-- Remove the blanket blocking policy that blocks ALL access and replace with anon-only blocking
DROP POLICY IF EXISTS "No public read access to order items" ON public.order_items;

CREATE POLICY "No public read access to order items" 
ON public.order_items 
FOR SELECT 
TO anon
USING (false);