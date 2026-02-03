-- Fix cookie_reviews privacy: remove identity link entirely and simplify policies

-- Remove now-unneeded public view
DROP VIEW IF EXISTS public.public_cookie_reviews;

-- Remove previous policies added during remediation attempts
DROP POLICY IF EXISTS "Anyone can view reviews via view" ON public.cookie_reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.cookie_reviews;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.cookie_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.cookie_reviews;

-- Drop identity column so reviews are anonymous at rest
ALTER TABLE public.cookie_reviews
  DROP COLUMN IF EXISTS profile_id;

-- Public read access (anonymous reviews only)
CREATE POLICY "Anyone can view reviews"
ON public.cookie_reviews
FOR SELECT
USING (true);

-- Public write access with basic validation guards
CREATE POLICY "Anyone can create reviews"
ON public.cookie_reviews
FOR INSERT
WITH CHECK (
  rating BETWEEN 1 AND 5
  AND char_length(cookie_name) BETWEEN 1 AND 60
  AND (review_text IS NULL OR char_length(review_text) <= 500)
);
