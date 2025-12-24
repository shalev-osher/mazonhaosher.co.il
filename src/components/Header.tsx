import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF5F5] backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center">
        <img src={logo} alt="מזון האושר" className="h-20 w-auto" />
      </div>
    </header>
  );
};

export default Header;
