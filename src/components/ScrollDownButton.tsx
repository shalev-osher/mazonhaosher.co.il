import { ChevronDown } from "lucide-react";

const ScrollDownButton = () => {
  const scrollToContent = () => {
    const cookiesSection = document.getElementById("cookies");
    if (cookiesSection) {
      cookiesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToContent}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary hover:border-transparent transition-all duration-300 hover:scale-110 group shadow-lg"
      aria-label="גלול למטה"
    >
      <ChevronDown className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
    </button>
  );
};

export default ScrollDownButton;