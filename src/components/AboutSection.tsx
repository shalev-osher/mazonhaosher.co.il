import { Heart, Leaf, Clock } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "מיוצר באהבה",
    description: "כל אצווה מוכנה בקפידה ובתשוקה, בדיוק כמו שסבתא הייתה עושה.",
  },
  {
    icon: Leaf,
    title: "מרכיבים טריים",
    description: "אנחנו מקפידים רק על המרכיבים הטריים והמשובחים ביותר.",
  },
  {
    icon: Clock,
    title: "נאפה יומית",
    description: "העוגיות שלנו נאפות טריות כל בוקר לטעם מושלם.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/40 to-accent/10" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent) / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.1) 0%, transparent 40%), radial-gradient(circle at 40% 80%, hsl(var(--golden-honey) / 0.1) 0%, transparent 45%)' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-base md:text-lg mb-2">
            הסיפור שלנו
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            אופים אושר, עוגייה אחת בכל פעם
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto">
            קראמבל התחיל במטבח ביתי קטן עם חלום פשוט: לשתף את החום והנוחות 
            של עוגיות ביתיות עם הקהילה שלנו.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex flex-col items-center text-center p-5 bg-card rounded-xl shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-accent/30 transition-all duration-300 group-hover:rotate-6">
                <feature.icon className="w-7 h-7 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;