import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const WHATSAPP_NUMBER = "972546791198";
const WHATSAPP_MESSAGE = "היי, אשמח להזמין עוגיות 🍪";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
              צרו קשר
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              מוכנים להזמין?
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
              בין אם אתם מתאווים לתריסר עוגיות לעצמכם או צריכים קייטרינג 
              לאירוע מיוחד, נשמח לשמוע מכם.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">שדרות קדש 39</p>
                  <p className="text-primary-foreground/70">אשקלון</p>
                </div>
              </div>

              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="font-medium group-hover:text-accent transition-colors">וואטסאפ</p>
                  <p className="text-primary-foreground/70" dir="ltr">054-679-1198</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium" dir="ltr">054-679-1198</p>
                  <p className="text-primary-foreground/70">להזמנות בטלפון</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">בהזמנה מראש</p>
                  <p className="text-primary-foreground/70">אספקה עד 3 ימי עסקים</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-elevated">
            <h3 className="font-display text-2xl font-semibold mb-6">
              שלחו לנו הודעה
            </h3>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">שם</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="השם שלכם"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">אימייל</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">הודעה</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                  placeholder="ספרו לנו על ההזמנה או השאלה שלכם..."
                />
              </div>
              <Button variant="honey" size="lg" className="w-full">
                שלחו הודעה
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
