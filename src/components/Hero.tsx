import { Button } from "./ui/button";
import heroImage from "@/assets/hero-cookies.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fresh baked crumble cookies"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
            Handcrafted with Love
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
            Homemade Cookies,{" "}
            <span className="text-accent">Crumbled</span> to Perfection
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Every cookie tells a story of fresh ingredients, family recipes, and 
            the warm embrace of home baking. Taste the difference of truly handmade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="honey" size="xl">
              Order Fresh Cookies
            </Button>
            <Button variant="outline" size="xl">
              View Our Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
