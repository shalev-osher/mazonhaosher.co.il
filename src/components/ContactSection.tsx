import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const WHATSAPP_NUMBER = "972546791198";
const WHATSAPP_MESSAGE = "היי, אשמח להזמין עוגיות 🍪";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            מוכנים להזמין?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10">
            הזמנות בקליק אחד דרך וואטסאפ
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="honey" size="lg" className="gap-3 text-lg px-10 py-6">
              <MessageCircle className="w-6 h-6" />
              הזמינו בוואטסאפ
            </Button>
          </a>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/70">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span>שדרות קדש 39, אשקלון</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span dir="ltr">054-679-1198</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <span>אספקה עד 3 ימי עסקים</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
