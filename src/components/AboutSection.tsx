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
    <section id="about" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
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
              className="flex flex-col items-center text-center p-5 bg-card rounded-xl shadow-soft animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3">
                <feature.icon className="w-6 h-6 text-accent" />
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
