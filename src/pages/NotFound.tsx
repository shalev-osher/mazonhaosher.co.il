import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if this might be an OAuth callback with hash or query params
    const hash = window.location.hash;
    const search = window.location.search;
    
    // OAuth callbacks often have access_token in hash or code in query
    const isOAuthCallback = 
      hash.includes("access_token") || 
      hash.includes("error") ||
      search.includes("code=") ||
      search.includes("error=");

    if (isOAuthCallback) {
      console.log("Detected OAuth callback, waiting for auth state...");
      
      // Give Supabase time to process the OAuth tokens
      const timeout = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log("OAuth session established, redirecting to home");
            navigate("/", { replace: true });
          } else {
            setIsCheckingAuth(false);
          }
        });
      }, 1000);

      // Also listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          console.log("OAuth sign-in successful, redirecting to home");
          navigate("/", { replace: true });
        }
      });

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } else {
      setIsCheckingAuth(false);
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname, navigate]);

  // Show loading while checking OAuth
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">מתחבר...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted" dir="rtl">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">אופס! הדף לא נמצא</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          חזרה לדף הבית
        </a>
      </div>
    </div>
  );
};

export default NotFound;