import CookieCard from "./CookieCard";
import chocolateCookie from "@/assets/cookie-chocolate.jpg";
import oatmealCookie from "@/assets/cookie-oatmeal.jpg";
import peanutCookie from "@/assets/cookie-peanut.jpg";
import snickerdoodleCookie from "@/assets/cookie-snickerdoodle.jpg";

const cookies = [
  {
    image: chocolateCookie,
    name: "Classic Chocolate Chunk",
    description: "Rich Belgian chocolate chunks nestled in a buttery, golden-brown cookie with a gooey center.",
    price: "$3.50",
  },
  {
    image: oatmealCookie,
    name: "Oatmeal Raisin Bliss",
    description: "Hearty rolled oats with plump raisins and a hint of cinnamon. A timeless comfort.",
    price: "$3.25",
  },
  {
    image: peanutCookie,
    name: "Peanut Butter Dream",
    description: "Creamy peanut butter cookie with the classic crosshatch pattern and melt-in-your-mouth texture.",
    price: "$3.50",
  },
  {
    image: snickerdoodleCookie,
    name: "Snickerdoodle Delight",
    description: "Soft and pillowy with a sweet cinnamon-sugar coating. Pure childhood nostalgia.",
    price: "$3.00",
  },
];

const CookiesSection = () => {
  return (
    <section id="cookies" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
            Our Signature Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fresh From the Oven
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each cookie is baked fresh daily using premium ingredients and 
            recipes passed down through generations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cookies.map((cookie, index) => (
            <CookieCard
              key={cookie.name}
              {...cookie}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CookiesSection;
