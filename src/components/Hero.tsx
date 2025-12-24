import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-cookies.jpg";

const WHATSAPP_NUMBER = "972546791198";
const WHATSAPP_MESSAGE = "היי, אשמח להזמין עוגיות 🍪";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="עוגיות קראמבל טריות מהתנור"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl me-auto animate-fade-in-up">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-xs mb-2">
            מיוצר באהבה
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            <span className="text-accent">מזון האושר</span>{" "}
            עוגיות ביתיות
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-md">
            עוגיות קראמבל אפויות בעבודת יד עם אהבה. בהזמנה מראש בלבד.
            אספקה עד 3 ימי עסקים.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="honey" 
              size="lg"
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`, '_blank')}
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              הזמינו בוואטסאפ
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('cookies')?.scrollIntoView({ behavior: 'smooth' })}>
              צפו בתפריט
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
