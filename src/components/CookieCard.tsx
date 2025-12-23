interface CookieCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  delay?: number;
}

const CookieCard = ({ image, name, description, price, delay = 0 }: CookieCardProps) => {
  return (
    <div 
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {name}
          </h3>
          <span className="text-accent font-bold text-lg">{price}</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CookieCard;
