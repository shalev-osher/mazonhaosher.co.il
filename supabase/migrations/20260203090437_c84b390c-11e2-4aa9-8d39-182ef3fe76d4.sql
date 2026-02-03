-- Create table for SMS OTP tokens
CREATE TABLE public.sms_otp_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  verified boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.sms_otp_tokens ENABLE ROW LEVEL SECURITY;

-- Block all direct access (only edge functions with service role can access)
CREATE POLICY "No direct access to sms_otp_tokens" 
ON public.sms_otp_tokens 
FOR ALL 
USING (false);

-- Create index for faster lookups
CREATE INDEX idx_sms_otp_phone ON public.sms_otp_tokens(phone);
CREATE INDEX idx_sms_otp_expires ON public.sms_otp_tokens(expires_at);

-- Cleanup function for expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_sms_otp_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM sms_otp_tokens WHERE expires_at < now();
END;
$$;