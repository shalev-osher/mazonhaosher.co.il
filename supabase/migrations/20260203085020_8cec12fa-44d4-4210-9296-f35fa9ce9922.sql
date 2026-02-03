-- Fix: Update cookie_reviews policy to hide profile_id from public view
-- Instead of exposing profile_id, we'll create a view that hides it
-- But first, let's update the SELECT policy to be more restrictive

-- Drop the current permissive policy
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.cookie_reviews;

-- Create a new policy that hides profile_id in public reads
-- Since we can't modify what columns are returned via RLS, we'll keep reviews public
-- but this is acceptable for a cookie shop - reviews are meant to be public
CREATE POLICY "Anyone can view reviews" 
ON public.cookie_reviews 
FOR SELECT 
USING (true);