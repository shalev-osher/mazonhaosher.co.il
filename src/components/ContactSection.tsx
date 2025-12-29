import { MapPin, Phone, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            צרו קשר
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/90 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>שדרות קדש 39, אשקלון</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span dir="ltr">054-679-1198</span>
            </div>
            <div className="flex items-center gap-2">
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