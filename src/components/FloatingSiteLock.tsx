const FloatingSiteLock = () => {
  return (
    <button
      onClick={() => window.open('https://www.sitelock.com/verify.php?site=mazonhaosher.co.il', 'SiteLock', 'width=600,height=600,left=160,top=170')}
      className="fixed right-3 bottom-28 z-50 transition-transform hover:scale-105 drop-shadow-lg"
    >
      <img 
        src="https://shield.sitelock.com/shield/mazonhaosher.co.il" 
        alt="SiteLock" 
        title="SiteLock" 
        className="h-8"
      />
    </button>
  );
};

export default FloatingSiteLock;
