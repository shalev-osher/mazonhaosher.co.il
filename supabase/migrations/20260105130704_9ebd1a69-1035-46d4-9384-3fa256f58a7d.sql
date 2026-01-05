-- Drop the overly permissive SELECT policy that allows viewing all packages
DROP POLICY IF EXISTS "Users can view their own packages" ON public.gift_packages;

-- Create proper ownership-based SELECT policy for authenticated users
CREATE POLICY "Authenticated users can view their own packages"
ON public.gift_packages
FOR SELECT
TO authenticated
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);