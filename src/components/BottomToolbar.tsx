import { useLanguage } from "@/contexts/LanguageContext";

const BottomToolbar = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-sm">
      <div className="flex items-center justify-center px-3 py-2 max-w-screen-xl mx-auto">
        <span className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">
          © {t('ui.brandName')} 2026
        </span>
      </div>
    </div>
  );
};

export default BottomToolbar;
