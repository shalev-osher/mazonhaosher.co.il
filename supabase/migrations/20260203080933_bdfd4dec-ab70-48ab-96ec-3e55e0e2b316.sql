-- Fix newsletter_subscriptions INSERT policy to add basic validation
-- Instead of true, require that at least email or phone is provided
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscriptions;

CREATE POLICY "Anyone can subscribe with valid data" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL OR phone IS NOT NULL
);