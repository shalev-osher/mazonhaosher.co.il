import Hero from "@/components/Hero";
import CookieGallery from "@/components/CookieGallery";
import Reviews from "@/components/Reviews";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <CookieGallery />
      <Reviews />
    </div>
  );
};

export default Index;
