-- Fix 1: Add RLS policy to otp_tokens table (only edge functions with service role should access)
-- The table should not be accessible from client side at all
CREATE POLICY "No direct access to otp_tokens" 
ON public.otp_tokens 
FOR ALL 
USING (false);

-- Fix 2: Update newsletter_subscriptions to be more restrictive
-- Keep INSERT open but add rate limiting consideration (handled in edge function)
-- The current policy is acceptable since we have rate limiting in edge function

-- Fix 3: Update gift_packages policy to require authentication for creating packages
DROP POLICY IF EXISTS "Anyone can create packages" ON public.gift_packages;

CREATE POLICY "Authenticated users can create packages" 
ON public.gift_packages 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    profile_id IS NULL 
    OR profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
);