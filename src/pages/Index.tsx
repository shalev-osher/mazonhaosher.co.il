import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CookieOfTheWeek from "@/components/CookieOfTheWeek";
import CookiesSection from "@/components/CookiesSection";
import GiftPackageBuilder from "@/components/GiftPackageBuilder";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import NewsletterSection from "@/components/NewsletterSection";
import OrderHistory from "@/components/OrderHistory";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";
import { CartProvider } from "@/contexts/CartContext";
import { ProfileProvider } from "@/contexts/ProfileContext";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ProfileProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Hero />
            <CookieOfTheWeek />
            <CookiesSection />
            <GiftPackageBuilder />
            <OrderHistory />
            <ReviewsSection />
            <FAQSection />
            <NewsletterSection />
            <AboutSection />
            <ContactSection />
          </main>
          <Footer />
          <FloatingWhatsApp />
          <CartButton onClick={() => setIsCartOpen(true)} />
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </CartProvider>
    </ProfileProvider>
  );
};

export default Index;
