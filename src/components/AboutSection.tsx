import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

// SVG icons as components with inline styles to prevent Tailwind purging
const HeartIcon = () => (
  <svg style={{ width: '24px', height: '24px', color: 'white' }} viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const LeafIcon = () => (
  <svg style={{ width: '24px', height: '24px', color: 'white' }} viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const ClockIcon = () => (
  <svg style={{ width: '24px', height: '24px', color: 'white' }} viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const AboutSection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });
  const { t } = useLanguage();

  const gradientStyles = [
    { background: 'linear-gradient(to bottom right, #ef4444, #e11d48)' }, // red to rose
    { background: 'linear-gradient(to bottom right, #10b981, #0d9488)' }, // emerald to teal
    { background: 'linear-gradient(to bottom right, #f59e0b, #ea580c)' }, // amber to orange
  ];

  const features = [
    {
      icon: HeartIcon,
      titleKey: 'about.madeWithLove',
      descKey: 'about.madeWithLoveDesc',
    },
    {
      icon: LeafIcon,
      titleKey: 'about.freshIngredients',
      descKey: 'about.freshIngredientsDesc',
    },
    {
      icon: ClockIcon,
      titleKey: 'about.dailyPrep',
      descKey: 'about.dailyPrepDesc',
    },
  ];
  
  return (
    <section id="about" ref={sectionRef} className="py-8 relative overflow-hidden">
      {/* Rich nature-inspired gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-green-950/40" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(155 65% 50% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(170 60% 45% / 0.25) 0%, transparent 45%), radial-gradient(circle at 40% 80%, hsl(145 55% 55% / 0.2) 0%, transparent 50%)' }} />
      {/* Leaf pattern */}
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5 Q35 15 30 30 Q20 35 10 30 Q5 15 20 5' fill='%2310b981' /%3E%3C/svg%3E")`, backgroundSize: '70px 70px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-4 transition-all duration-700 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-emerald-600 font-medium tracking-wider uppercase text-sm mb-1">
            {t('about.ourStory')}
          </span>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
            {t('about.headline')}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
            {t('about.description')}
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-3 transition-all duration-700 delay-200 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {features.map((feature, index) => {
            return (
              <div 
                key={feature.titleKey}
                className="flex flex-col items-center text-center p-3 bg-card rounded-lg shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6 shadow-lg"
                  style={gradientStyles[index]}
                >
                  <feature.icon />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-0.5">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
