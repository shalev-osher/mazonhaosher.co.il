-- Lock down direct client inserts into newsletter_subscriptions.
-- Subscriptions should be created only through the backend function (which rate-limits and validates).

DROP POLICY IF EXISTS "Anyone can subscribe with valid data" ON public.newsletter_subscriptions;

-- Deny direct inserts for anon/authenticated roles (service role used by backend remains unaffected)
REVOKE INSERT ON public.newsletter_subscriptions FROM anon, authenticated;
