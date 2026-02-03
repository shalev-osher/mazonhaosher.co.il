import { Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

// Waze official icon component
const WazeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 512 512" 
    className={className}
    fill="currentColor"
  >
    {/* Waze “Wazer” icon (monochrome) */}
    <path d="M428 224a156.12 156.12 0 0 0-156-156c-112 0-156 84-156 156 0 32 12.8 56 20 72-12 16-32.4 33.6-48 48a28.69 28.69 0 0 0 20 48h280a156.12 156.12 0 0 0 156-156c0-4.4-.4-8.4-1.2-12.4zM283.6 296c-15.6 0-28.4-12.8-28.4-28.4s12.8-28.4 28.4-28.4 28.4 12.8 28.4 28.4-12.8 28.4-28.4 28.4zm96 0c-15.6 0-28.4-12.8-28.4-28.4s12.8-28.4 28.4-28.4 28.4 12.8 28.4 28.4-12.8 28.4-28.4 28.4z" />
    <circle cx="168" cy="404" r="32" />
    <circle cx="344" cy="404" r="32" />
  </svg>
);

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  
  const openWaze = () => {
    // Waze deep link with address search for Sderot Kadesh 39, Ashkelon
    window.open("https://waze.com/ul?q=שדרות%20קדש%2039%20אשקלון&navigate=yes", "_blank");
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
            className="mb-4 bg-[#05c8f7] hover:bg-[#04b5e0] text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <WazeIcon className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
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