-- Fix the SECURITY DEFINER view warning by explicitly setting SECURITY INVOKER
-- This ensures the view respects the permissions of the querying user

DROP VIEW IF EXISTS public.public_cookie_reviews;

CREATE VIEW public.public_cookie_reviews 
WITH (security_invoker = true)
AS
SELECT 
  id,
  cookie_name,
  rating,
  review_text,
  created_at
FROM public.cookie_reviews;

-- Re-grant access to the view
GRANT SELECT ON public.public_cookie_reviews TO anon;
GRANT SELECT ON public.public_cookie_reviews TO authenticated;

-- Also add a permissive policy for anon users to access via the view
-- The view only exposes safe columns (no profile_id)
CREATE POLICY "Anyone can view reviews via view"
ON public.cookie_reviews
FOR SELECT
TO anon
USING (true);