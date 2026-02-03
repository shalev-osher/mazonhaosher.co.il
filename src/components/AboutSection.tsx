import { Heart, Leaf, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });
  const { t } = useLanguage();

  const features = [
    {
      icon: Heart,
      titleKey: 'about.madeWithLove',
      descKey: 'about.madeWithLoveDesc',
    },
    {
      icon: Leaf,
      titleKey: 'about.freshIngredients',
      descKey: 'about.freshIngredientsDesc',
    },
    {
      icon: Clock,
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
            const colors = [
              { bg: "bg-red-500/20", hover: "bg-red-500/30", text: "text-red-500" },
              { bg: "bg-emerald-500/20", hover: "bg-emerald-500/30", text: "text-emerald-500" },
              { bg: "bg-amber-500/20", hover: "bg-amber-500/30", text: "text-amber-500" },
            ];
            const color = colors[index % colors.length];
            return (
              <div 
                key={feature.titleKey}
                className="flex flex-col items-center text-center p-3 bg-card rounded-lg shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  index === 0 ? 'from-red-500 to-rose-600' : 
                  index === 1 ? 'from-emerald-500 to-teal-600' : 
                  'from-amber-500 to-orange-600'
                } rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white fill-white/20 group-hover:scale-110 transition-transform duration-300" />
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
