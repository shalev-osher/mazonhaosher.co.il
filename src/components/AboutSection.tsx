import { Heart, Leaf, Clock } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every batch is crafted with care and passion, just like grandma used to make.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "We source only the finest, freshest ingredients from local suppliers.",
  },
  {
    icon: Clock,
    title: "Baked Daily",
    description: "Our cookies are baked fresh every morning for maximum deliciousness.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Baking Happiness, One Cookie at a Time
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Crumble started in a small home kitchen with a simple dream: to share 
              the warmth and comfort of homemade cookies with our community. What 
              began as weekend baking sessions has grown into a beloved local bakery, 
              but our heart remains the same.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe that the best cookies come from the best ingredients, 
              time-honored techniques, and a whole lot of love. Every crumble 
              tells our story—and now, it's part of yours.
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
