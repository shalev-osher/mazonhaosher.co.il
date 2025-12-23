import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "972546791198";
const WHATSAPP_MESSAGE = "היי, אשמח להזמין עוגיות 🍪";

const FloatingWhatsApp = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="הזמינו בוואטסאפ"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute right-16 bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        הזמינו בוואטסאפ
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
