-- Fix: Add explicit denial policy for public reads on order_items table
-- This prevents unauthenticated users from accessing order details even if they guess order_id values

-- First, let's ensure we have a policy that explicitly blocks anonymous/public SELECT access
-- The existing policies only allow authenticated users who own the orders, but we need explicit denial

CREATE POLICY "No public read access to order items" 
ON public.order_items 
FOR SELECT 
TO anon
USING (false);