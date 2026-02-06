const FloatingCopyright = () => {
  return (
    <div className="fixed left-0 bottom-28 z-50">
      <div className="flex flex-col items-center py-3 px-4 bg-background/95 backdrop-blur-sm border border-l-0 border-border rounded-r-xl shadow-lg">
        <span className="text-xs font-medium text-foreground">© מזון האושר 2026</span>
        <span className="text-[10px] text-muted-foreground">MAZON HAOSHER 2026</span>
      </div>
    </div>
  );
};

export default FloatingCopyright;
