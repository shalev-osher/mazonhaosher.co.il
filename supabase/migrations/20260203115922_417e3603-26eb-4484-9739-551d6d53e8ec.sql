-- Drop the old permissive insert policy
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.cookie_reviews;

-- Create a new policy that only allows authenticated users to insert reviews
CREATE POLICY "Only authenticated users can create reviews"
ON public.cookie_reviews
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND rating >= 1
  AND rating <= 5
  AND char_length(cookie_name) >= 1
  AND char_length(cookie_name) <= 60
  AND (review_text IS NULL OR char_length(review_text) <= 500)
);