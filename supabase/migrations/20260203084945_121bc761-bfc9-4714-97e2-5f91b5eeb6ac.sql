-- Fix: Remove the problematic policy that allows creating profiles without user_id
-- Guest checkout should create profiles through the edge function with service role only
-- This prevents phone number harvesting attacks

-- Remove the policy allowing anonymous profile creation
DROP POLICY IF EXISTS "Anyone can create profile with phone" ON public.profiles;