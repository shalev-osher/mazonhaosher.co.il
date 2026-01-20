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
    <section id="about" className="py-8 relative overflow-hidden">
      {/* Decorative background - stronger pink gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary to-accent/25" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent) / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.35) 0%, transparent 40%), radial-gradient(circle at 40% 80%, hsl(var(--golden-honey) / 0.25) 0%, transparent 45%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlODVkOGYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-4 animate-fade-in">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-1">
            הסיפור שלנו
          </span>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
            אופים אושר, עוגייה אחת בכל פעם
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
            קראמבל התחיל במטבח ביתי קטן עם חלום פשוט: לשתף את החום והנוחות 
            של עוגיות ביתיות עם הקהילה שלנו.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex flex-col items-center text-center p-3 bg-card rounded-lg shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-accent/30 transition-all duration-300 group-hover:rotate-6">
                <feature.icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground mb-0.5">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-xs">
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