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
import { CartProvider, useCart } from "@/contexts/CartContext";

const IndexContent = () => {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
  );
};

const Index = () => {
  return (
    <CartProvider>
      <IndexContent />
    </CartProvider>
  );
};

export default Index;
