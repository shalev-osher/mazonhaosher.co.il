import Hero from "@/components/Hero";
import CookieGallery from "@/components/CookieGallery";
import AboutUs from "@/components/AboutUs";
import Reviews from "@/components/Reviews";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <CookieGallery />
      <AboutUs />
      <Reviews />
    </div>
  );
};

export default Index;
