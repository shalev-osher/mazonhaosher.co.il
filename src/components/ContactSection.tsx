import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const WHATSAPP_NUMBER = "972546791198";
const WHATSAPP_MESSAGE = "היי, אשמח להזמין עוגיות 🍪";

const ContactSection = () => {
  return (
    <section id="contact" className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            מוכנים להזמין?
          </h2>
          <p className="text-primary-foreground/80 text-base leading-relaxed mb-6">
            הזמנות בקליק אחד דרך וואטסאפ
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="honey" size="lg" className="gap-2 text-base px-8 py-5">
              <MessageCircle className="w-5 h-5" />
              הזמינו בוואטסאפ
            </Button>
          </a>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/70 text-sm">
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
