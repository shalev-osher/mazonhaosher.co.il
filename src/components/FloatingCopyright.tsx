import { useLanguage } from "@/contexts/LanguageContext";

const FloatingCopyright = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center px-3 py-1 bg-background border border-border rounded-full shadow-sm">
        <span className="text-[10px] font-medium text-muted-foreground">
          {isRTL ? "© מזון האושר 2026" : "© Mazon HaOsher 2026"}
        </span>
      </div>
    </div>
  );
};

export default FloatingCopyright;
