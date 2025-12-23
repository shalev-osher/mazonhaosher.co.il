import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "./ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
              Get in Touch
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Order?
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
              Whether you're craving a dozen cookies for yourself or need catering 
              for a special event, we'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">123 Baker Street</p>
                  <p className="text-primary-foreground/70">Sweet Valley, CA 90210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">(555) 123-4567</p>
                  <p className="text-primary-foreground/70">Call for orders</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">hello@crumblecookies.com</p>
                  <p className="text-primary-foreground/70">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Tue - Sun: 8am - 6pm</p>
                  <p className="text-primary-foreground/70">Closed Mondays</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-elevated">
            <h3 className="font-display text-2xl font-semibold mb-6">
              Send us a Message
            </h3>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us about your order or question..."
                />
              </div>
              <Button variant="honey" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
