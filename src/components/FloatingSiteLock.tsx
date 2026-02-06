const FloatingSiteLock = () => {
  return (
    <div className="fixed right-0 bottom-28 z-50">
      <button
        onClick={() => window.open('https://www.sitelock.com/verify.php?site=mazonhaosher.co.il', 'SiteLock', 'width=600,height=600,left=160,top=170')}
        className="flex items-center py-2 px-3 bg-background/95 backdrop-blur-sm border border-r-0 border-border rounded-l-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl origin-right"
      >
        <img 
          src="https://shield.sitelock.com/shield/mazonhaosher.co.il" 
          alt="SiteLock" 
          title="SiteLock" 
          className="h-7"
        />
      </button>
    </div>
  );
};

export default FloatingSiteLock;
