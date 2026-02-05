import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

// SVG icons as components with inline styles to prevent Tailwind purging
const TruckIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
    <path d="M15 18H9"/>
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
    <circle cx="17" cy="18" r="2"/>
    <circle cx="7" cy="18" r="2"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
    <path d="M12 9v4"/>
    <path d="M12 17h.01"/>
  </svg>
);

const PackageIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/>
    <path d="M12 22V12"/>
  </svg>
);

const HelpCircleIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
);

const FAQSection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });
  const { t, isRTL } = useLanguage();

  const iconGradientStyle = { background: 'linear-gradient(to bottom right, #0ea5e9, #06b6d4)' };

  const faqs = [
    {
      icon: TruckIcon,
      question: t('faq.delivery'),
      answer: t('faq.deliveryAnswer'),
    },
    {
      icon: CreditCardIcon,
      question: t('faq.payment'),
      answer: t('faq.paymentAnswer'),
    },
    {
      icon: ClockIcon,
      question: t('faq.freshness'),
      answer: t('faq.freshnessAnswer'),
    },
    {
      icon: AlertTriangleIcon,
      question: t('faq.allergens'),
      answer: t('faq.allergensAnswer'),
    },
    {
      icon: PackageIcon,
      question: t('faq.events'),
      answer: t('faq.eventsAnswer'),
    },
    {
      icon: HelpCircleIcon,
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
                    <div className="p-2 rounded-xl shadow-md" style={iconGradientStyle}>
                      <faq.icon />
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
