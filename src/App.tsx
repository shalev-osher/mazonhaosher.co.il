import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const OAuthHandler = ({ children }: { children: React.ReactNode }) => {
  const [isHandlingOAuth, setIsHandlingOAuth] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const isOAuthCallback = hash.includes("access_token") || hash.includes("error");

    if (isOAuthCallback) {
      setIsHandlingOAuth(true);
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) console.error("OAuth error:", error);
        if (session) window.history.replaceState(null, "", window.location.pathname);
        setIsHandlingOAuth(false);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && isOAuthCallback) {
        window.history.replaceState(null, "", window.location.pathname);
        setIsHandlingOAuth(false);
      }
    });

    return () => { subscription.unsubscribe(); };
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
          <Toaster />
          <Sonner />
          <BrowserRouter>
            
            <OAuthHandler>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OAuthHandler>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
