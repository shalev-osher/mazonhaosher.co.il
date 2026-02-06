import { useLanguage } from "@/contexts/LanguageContext";

const FloatingCopyright = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-28 z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
      <div className={`flex flex-col items-center py-3 px-4 bg-background/95 backdrop-blur-sm border border-border shadow-lg ${isRTL ? 'border-l-0 rounded-r-xl' : 'border-r-0 rounded-l-xl'}`}>
        <span className="text-xs font-medium text-foreground">
          {isRTL ? "© מזון האושר 2026" : "© Mazon HaOsher 2026"}
        </span>
      </div>
    </div>
  );
};

export default FloatingCopyright;
