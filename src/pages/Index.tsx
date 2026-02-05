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
import ScrollDownButton from "@/components/ScrollDownButton";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingAuthButton from "@/components/FloatingAuthButton";
import WelcomePopup from "@/components/WelcomePopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-28">
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
      <ScrollDownButton />
      <ScrollToTop />
      <FloatingAuthButton />
      <WelcomePopup />
    </div>
  );
};

export default Index;
