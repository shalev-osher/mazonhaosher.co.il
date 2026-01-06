-- Fix 1: Add SELECT policy to newsletter_subscriptions that denies all reads
-- Only service role can access this data (for admin export)
CREATE POLICY "No public read access to newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
USING (false);

-- Fix 2: For guest orders - we'll update the error messages in code to prevent 
-- phone enumeration, since guest checkout is a legitimate business requirement.
-- The current RLS is actually correct - we just need to handle it at application level.

-- Fix 3: For guest profile creation - the risk is phone enumeration.
-- We'll add a comment note but keep the policy since guest checkout is required.
-- The fix will be in the application code to use generic error messages.