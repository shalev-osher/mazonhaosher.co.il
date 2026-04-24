import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Home, ArrowRight, Cookie } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    document.title = "404 | הדף לא נמצא — מזון האושר";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "הדף שחיפשת לא נמצא. חזור לדף הבית של מזון האושר ליהנות מעוגיות אמריקאיות בעבודת יד.");

    const hash = window.location.hash;
    const search = window.location.search;
    const isOAuthCallback =
      hash.includes("access_token") || hash.includes("error") ||
      search.includes("code=") || search.includes("error=");

    if (isOAuthCallback) {
      const timeout = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) navigate("/", { replace: true });
          else setIsCheckingAuth(false);
        });
      }, 1000);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) navigate("/", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/40 to-background overflow-hidden relative px-4" dir="rtl">
      {/* Floating cookies background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10 pointer-events-none"
          style={{
            left: `${15 + i * 14}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <Cookie className="h-16 w-16" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg"
      >
        {/* Animated 404 with broken cookie */}
        <div className="relative mb-8 flex items-center justify-center gap-2">
          <motion.span
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-[8rem] md:text-[10rem] font-bold leading-none bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
            style={{ fontFamily: '"Secular One", sans-serif' }}
          >
            4
          </motion.span>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Cookie className="h-28 w-28 md:h-36 md:w-36 text-primary drop-shadow-lg" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
          <motion.span
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-[8rem] md:text-[10rem] font-bold leading-none bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
            style={{ fontFamily: '"Secular One", sans-serif' }}
          >
            4
          </motion.span>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-3 text-foreground"
        >
          אופס! העוגייה הזו נאכלה
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          הדף שחיפשת לא קיים, אבל יש לנו המון עוגיות טריות בדף הבית
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowRight className="h-4 w-4" />
            חזור אחורה
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-muted-foreground/70"
        >
          נתיב מבוקש: <code className="bg-muted px-2 py-0.5 rounded">{location.pathname}</code>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
