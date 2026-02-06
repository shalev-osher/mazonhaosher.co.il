import { useLanguage } from "@/contexts/LanguageContext";

const FloatingSiteLock = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-[76px] z-40 ${isRTL ? 'right-3' : 'left-3'}`}>
      <button
        onClick={() => window.open('https://www.sitelock.com/verify.php?site=mazonhaosher.co.il', 'SiteLock', 'width=600,height=600,left=160,top=170')}
        className="flex items-center p-1.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <img 
          src="https://shield.sitelock.com/shield/mazonhaosher.co.il" 
          alt="SiteLock" 
          title="SiteLock" 
          className="h-8"
        />
      </button>
    </div>
  );
};

export default FloatingSiteLock;
