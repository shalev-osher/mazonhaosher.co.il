import { Heart, Leaf, Clock } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "מיוצר באהבה",
    description: "כל אצווה מוכנת בקפידה ובתשוקה, בדיוק כמו שסבתא הייתה עושה.",
  },
  {
    icon: Leaf,
    title: "מרכיבים טריים",
    description: "אנחנו מקפידים רק על המרכיבים הטריים והמשובחים ביותר מספקים מקומיים.",
  },
  {
    icon: Clock,
    title: "נאפה יומית",
    description: "העוגיות שלנו נאפות טריות כל בוקר לטעם מושלם.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
              הסיפור שלנו
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              אופים אושר, עוגייה אחת בכל פעם
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              קראמבל התחיל במטבח ביתי קטן עם חלום פשוט: לשתף את החום והנוחות 
              של עוגיות ביתיות עם הקהילה שלנו. מה שהתחיל כאפייה בסופי שבוע 
              הפך למאפייה מקומית אהובה, אבל הלב שלנו נשאר אותו הדבר.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              אנחנו מאמינים שהעוגיות הטובות ביותר מגיעות מהמרכיבים הטובים ביותר, 
              טכניקות מסורתיות, והמון אהבה. כל פירור מספר את הסיפור שלנו—ועכשיו, 
              הוא חלק מהסיפור שלכם.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex gap-5 p-6 bg-card rounded-2xl shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
