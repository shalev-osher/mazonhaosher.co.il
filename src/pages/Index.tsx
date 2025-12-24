import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CookiesSection from "@/components/CookiesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";
import { CartProvider } from "@/contexts/CartContext";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <CookiesSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <CartButton onClick={() => setIsCartOpen(true)} />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
};

export default Index;