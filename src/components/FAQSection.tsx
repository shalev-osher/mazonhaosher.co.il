import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Truck, CreditCard, Clock, Package, AlertTriangle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });
  const { t, isRTL } = useLanguage();

  const faqs = [
    {
      icon: Truck,
      question: t('faq.delivery'),
      answer: t('faq.deliveryAnswer'),
    },
    {
      icon: CreditCard,
      question: t('faq.payment'),
      answer: t('faq.paymentAnswer'),
    },
    {
      icon: Clock,
      question: t('faq.freshness'),
      answer: t('faq.freshnessAnswer'),
    },
    {
      icon: AlertTriangle,
      question: t('faq.allergens'),
      answer: t('faq.allergensAnswer'),
    },
    {
      icon: Package,
      question: t('faq.events'),
      answer: t('faq.eventsAnswer'),
    },
    {
      icon: HelpCircle,
      question: t('faq.contact'),
      answer: t('faq.contactAnswer'),
    },
  ];
  
  return (
    <section id="faq" ref={sectionRef} className="py-10 relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-100 dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-teal-950/40" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(200 80% 60% / 0.25) 0%, transparent 45%), radial-gradient(circle at 80% 70%, hsl(175 70% 50% / 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 90%, hsl(190 75% 55% / 0.15) 0%, transparent 40%)' }} />
      {/* Question mark pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='28' font-size='20' text-anchor='middle' fill='%230ea5e9'%3E%3F%3C/text%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-6 transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-sky-600 mb-2">
            {t('faq.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className={`max-w-2xl mx-auto transition-all duration-700 delay-200 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/80 backdrop-blur-sm border border-sky-500/20 rounded-xl px-4 overflow-hidden"
              >
                <AccordionTrigger className={`hover:no-underline py-3 gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl shadow-md">
                      <faq.icon className="h-4 w-4 text-white fill-white/20" />
                    </div>
                    <span className="font-semibold text-sm">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={`text-muted-foreground pb-3 text-sm leading-relaxed ${isRTL ? 'pr-10' : 'pl-10'}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
