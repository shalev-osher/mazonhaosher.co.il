import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

// SVG icon with inline styles to prevent Tailwind purging
const ShoppingBagIcon = () => (
  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const cartGradientStyle = { background: 'linear-gradient(to bottom right, #f59e0b, #ea580c)' };

const Footer = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isRTL } = useLanguage();
  const itemCount = getTotalItems();
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-40 py-0.5 bg-background border-t border-amber-500/30">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <div className="w-12 md:w-16 flex justify-center">
              <ThemeToggle />
            </div>
            
            {/* Cart */}
            <div className="w-12 md:w-16 flex justify-center">
              <button onClick={() => navigate("/cart")} className="relative flex flex-col items-center gap-0.5 py-0.5 transition-all duration-300 rounded-lg group hover:bg-muted px-2">
                <div className="p-1 md:p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-all duration-300" style={cartGradientStyle}>
                  <ShoppingBagIcon />
                </div>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                  {isRTL ? 'עגלה' : 'Cart'}
                </span>
              </button>
            </div>

            {/* Language Toggle */}
            <div className="w-12 md:w-16 flex justify-center">
              <LanguageToggle />
            </div>

            {/* WhatsApp */}
            <div className="w-12 md:w-16 flex justify-center">
              <a href="https://wa.me/972546791198" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-0.5 transition-all duration-300 rounded-lg group hover:bg-muted px-2">
                <div className="p-1 md:p-1.5 rounded-lg bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-sm group-hover:scale-105 transition-all duration-300">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                  WhatsApp
                </span>
              </a>
            </div>
            
            {/* Facebook */}
            <div className="w-14 md:w-20 flex justify-center">
              <a href="https://www.facebook.com/p/%D7%9E%D7%96%D7%95%D7%9F-%D7%94%D7%90%D7%95%D7%A9%D7%A8-61565573526817/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-0.5 transition-all duration-300 rounded-lg group hover:bg-muted px-2">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#0d5fc4] shadow-md group-hover:scale-105 transition-all duration-300">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  Facebook
                </span>
              </a>
            </div>

            {/* Instagram */}
            <div className="w-14 md:w-20 flex justify-center">
              <a href="https://www.instagram.com/mazonaosher/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-0.5 transition-all duration-300 rounded-lg group hover:bg-muted px-2">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] shadow-md group-hover:scale-105 transition-all duration-300">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  Instagram
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;