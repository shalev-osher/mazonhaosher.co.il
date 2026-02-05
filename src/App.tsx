import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import NewsletterUnsubscribe from "./pages/NewsletterUnsubscribe";

const queryClient = new QueryClient();

// OAuth callback handler component
const OAuthHandler = ({ children }: { children: React.ReactNode }) => {
  const [isHandlingOAuth, setIsHandlingOAuth] = useState(false);

  useEffect(() => {
    // Check if this is an OAuth callback (hash contains access_token or error)
    const hash = window.location.hash;
    const isOAuthCallback = hash.includes("access_token") || hash.includes("error");

    if (isOAuthCallback) {
      setIsHandlingOAuth(true);
      console.log("OAuth callback detected, processing...");

      // Supabase client will automatically handle the hash and set the session
      // We just need to wait for it to complete
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error("OAuth error:", error);
        }
        if (session) {
          console.log("OAuth session established successfully");
          // Clear the hash from URL for clean look
          window.history.replaceState(null, "", window.location.pathname);
        }
        setIsHandlingOAuth(false);
      });
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && isOAuthCallback) {
        console.log("OAuth sign-in completed");
        window.history.replaceState(null, "", window.location.pathname);
        setIsHandlingOAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isHandlingOAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">מתחבר...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <ProfileProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <OAuthHandler>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                   <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </OAuthHandler>
            </BrowserRouter>
          </ProfileProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
