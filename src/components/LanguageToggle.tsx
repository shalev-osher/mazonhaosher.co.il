import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleLanguage}
          className="p-2.5 rounded-full shadow-md hover:scale-105 transition-all duration-300"
          style={{ background: "linear-gradient(to bottom right, #f43f5e, #db2777)" }}
          aria-label={language === "he" ? "Switch to English" : "עבור לעברית"}
        >
          <svg 
            className="w-4 h-4 text-white"
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
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {language === "he" ? "שפה" : "Language"}
      </TooltipContent>
    </Tooltip>
  );
};

export default LanguageToggle;
