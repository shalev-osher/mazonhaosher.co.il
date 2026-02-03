// Wrapper around Lovable Cloud OAuth that works reliably on custom domains.
// We intentionally use an absolute OAuth broker URL to avoid 404s on domains
// that don't automatically proxy the /~oauth/* path.

import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { supabase } from "@/integrations/supabase/client";

const lovableAuth = createLovableAuth({
  oauthBrokerUrl: "https://oauth.lovable.app/~oauth/initiate",
  supportedOAuthOrigins: ["https://oauth.lovable.app"],
});

export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: "google" | "apple",
      opts?: { redirect_uri?: string; extraParams?: Record<string, string> }
    ) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        ...opts,
      });

      if (result.redirected) {
        return result;
      }

      if (result.error) {
        return result;
      }

      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    },
  },
};
