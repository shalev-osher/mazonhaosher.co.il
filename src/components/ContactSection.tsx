import { MapPin, Phone, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-6 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/80" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.5) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-lg mx-auto animate-fade-in text-primary-foreground">
          <h2 className="font-display text-xl md:text-2xl font-bold mb-2">
            צרו קשר
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-primary-foreground/90 text-sm">
            <div className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300">
              <MapPin className="w-4 h-4" />
              <span>שדרות קדש 39, אשקלון</span>
            </div>
            <div className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300">
              <Phone className="w-4 h-4" />
              <span dir="ltr">054-679-1198</span>
            </div>
            <div className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300">
              <Clock className="w-4 h-4" />
              <span>אספקה עד 3 ימי עסקים</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;