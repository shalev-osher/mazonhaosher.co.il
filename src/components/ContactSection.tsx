import { Clock, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  
  const openWaze = () => {
    // Waze deep link to Sderot Kadesh 39, Ashkelon
    window.open("https://waze.com/ul?ll=31.6689,34.5743&navigate=yes&zoom=17", "_blank");
  };
  
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
          <div className="rounded-xl overflow-hidden shadow-lg mb-3 border-2 border-white/20">
            <iframe
              src={isRTL 
                ? "https://maps.google.com/maps?q=שדרות+קדש+39+אשקלון+ישראל&t=&z=17&ie=UTF8&iwloc=&output=embed&hl=he"
                : "https://maps.google.com/maps?q=Sderot+Kadesh+39+Ashkelon+Israel&t=&z=17&ie=UTF8&iwloc=&output=embed&hl=en"
              }
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

          {/* Waze Navigation Button */}
          <Button
            onClick={openWaze}
            className="mb-4 bg-[#33ccff] hover:bg-[#29a8d4] text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Navigation className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {isRTL ? "נווט אלינו עם Waze" : "Navigate with Waze"}
          </Button>

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