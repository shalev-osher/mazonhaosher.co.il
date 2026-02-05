import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex flex-col items-center gap-0.5 py-0.5 px-2",
        "transition-all duration-300 rounded-lg group hover:bg-muted"
      )}
      aria-label={language === "he" ? "Switch to English" : "עבור לעברית"}
    >
      <div 
        className="p-1 md:p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-all duration-300"
        style={{ background: "linear-gradient(to bottom right, #f43f5e, #db2777)" }}
      >
        <svg 
          className="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>
      <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
        {language === "he" ? "עברית" : "English"}
      </span>
    </button>
  );
};

export default LanguageToggle;
