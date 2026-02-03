-- Create a public view for cookie reviews that hides profile_id
-- This prevents exposing user identity while still showing reviews publicly

CREATE VIEW public.public_cookie_reviews AS
SELECT 
  id,
  cookie_name,
  rating,
  review_text,
  created_at
FROM public.cookie_reviews;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.public_cookie_reviews TO anon;
GRANT SELECT ON public.public_cookie_reviews TO authenticated;

-- Update RLS policy on cookie_reviews to be more restrictive for SELECT
-- Only authenticated users can see their own reviews with profile_id
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.cookie_reviews;

-- Create new policy: only allow profile owners to see their own reviews via direct table access
CREATE POLICY "Users can view their own reviews"
ON public.cookie_reviews
FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);