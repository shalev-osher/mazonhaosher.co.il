import { Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <section id="contact" className="py-6 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, hsl(40 90% 55%) 0%, transparent 40%), radial-gradient(circle at 100% 100%, hsl(25 90% 50% / 0.5) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto animate-fade-in text-white">
          <h2 className="font-display text-xl md:text-2xl font-bold mb-4">
            {t('contact.title')}
          </h2>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-lg mb-4 border-2 border-white/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d847.5!2d34.5712!3d31.6658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502673a5c0d5555%3A0x0!2zNTMg16nXk9eo15XXqiDXp9eT16ksINeQ16nXp9ec15XXnw!5e0!3m2!1siw!2sil!4v1706000000000!5m2!1siw!2sil"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={isRTL ? "מפה - שדרות קדש 39, אשקלון" : "Map - Sderot Kadesh 39, Ashkelon"}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-white/90 text-sm hover:scale-105 transition-transform duration-300">
            <Clock className="w-4 h-4" />
            <span>{t('contact.hours')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;