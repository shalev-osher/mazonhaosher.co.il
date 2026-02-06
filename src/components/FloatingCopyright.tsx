import { useLanguage } from "@/contexts/LanguageContext";

const FloatingCopyright = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-[72px] z-40 ${isRTL ? 'left-3' : 'right-3'}`}>
      <div className="flex items-center px-3 py-1.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg">
        <span className="text-[10px] font-medium text-muted-foreground">
          {isRTL ? "© מזון האושר 2026" : "© Mazon HaOsher 2026"}
        </span>
      </div>
    </div>
  );
};

export default FloatingCopyright;
