import { useLanguage } from "@/contexts/LanguageContext";

const FloatingSiteLock = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-28 z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
      <button
        onClick={() => window.open('https://www.sitelock.com/verify.php?site=mazonhaosher.co.il', 'SiteLock', 'width=600,height=600,left=160,top=170')}
        className={`flex items-center py-3 px-4 bg-background/95 backdrop-blur-sm border border-border shadow-lg transition-all hover:scale-105 hover:shadow-xl ${isRTL ? 'border-r-0 rounded-l-xl origin-right' : 'border-l-0 rounded-r-xl origin-left'}`}
      >
        <img 
          src="https://shield.sitelock.com/shield/mazonhaosher.co.il" 
          alt="SiteLock" 
          title="SiteLock" 
          className="h-10"
        />
      </button>
    </div>
  );
};

export default FloatingSiteLock;
