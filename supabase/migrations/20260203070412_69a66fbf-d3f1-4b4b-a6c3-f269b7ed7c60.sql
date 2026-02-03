-- Create OTP tokens table for secure 2FA verification
CREATE TABLE public.otp_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  verified boolean NOT NULL DEFAULT false
);

-- Create index for fast lookup by email
CREATE INDEX idx_otp_tokens_email ON public.otp_tokens(email);

-- Create index for cleanup of expired tokens
CREATE INDEX idx_otp_tokens_expires_at ON public.otp_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.otp_tokens ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can manage tokens
-- (Edge functions use service role)

-- Cleanup function for expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM otp_tokens WHERE expires_at < now();
END;
$$;