import { Clock, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Waze official colorful icon component
const WazeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className}
  >
    {/* White face with outline */}
    <path d="M24 4C12.95 4 4 12.95 4 24c0 6.62 3.22 12.49 8.17 16.13-.09.62-.17 1.27-.17 1.87 0 3.31 2.69 6 6 6s6-2.69 6-6c0-.06-.02-.12-.02-.18.66.12 1.33.18 2.02.18.69 0 1.36-.06 2.02-.18 0 .06-.02.12-.02.18 0 3.31 2.69 6 6 6s6-2.69 6-6c0-.6-.08-1.25-.17-1.87C44.78 36.49 48 30.62 48 24c0-11.05-8.95-20-20-20h-4z" fill="#FFFFFF" stroke="#AAA" strokeWidth="1"/>
    {/* Left eye */}
    <ellipse cx="17" cy="22" rx="4" ry="5" fill="#000000"/>
    <circle cx="18.5" cy="21" r="1.5" fill="#FFFFFF"/>
    {/* Right eye */}
    <ellipse cx="31" cy="22" rx="4" ry="5" fill="#000000"/>
    <circle cx="32.5" cy="21" r="1.5" fill="#FFFFFF"/>
    {/* Smile */}
    <path d="M16 32c0 0 4 6 8 6s8-6 8-6" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const contactSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  phone: z.string().regex(/^[0-9\-\s]{9,15}$/, "מספר טלפון לא תקין"),
  message: z.string().trim().min(10, "הודעה חייבת להכיל לפחות 10 תווים").max(1000, "הודעה ארוכה מדי"),
});

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const openWaze = () => {
    window.open("https://waze.com/ul?q=שדרות%20קדש%2039%20אשקלון&navigate=yes", "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: isRTL ? "שגיאה" : "Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-form", {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: isRTL ? "נשלח בהצלחה!" : "Sent successfully!",
        description: isRTL ? "נחזור אליך בהקדם" : "We'll get back to you soon",
      });

      setFormData({ name: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast({
        title: isRTL ? "שגיאה" : "Error",
        description: isRTL ? "שגיאה בשליחת ההודעה, נסו שוב" : "Error sending message, please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="contact" className="py-6 relative overflow-hidden">
      {/* Decorative gradient background - Blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-600" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, hsl(220 90% 55%) 0%, transparent 40%), radial-gradient(circle at 100% 100%, hsl(200 90% 50% / 0.5) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto animate-fade-in text-white">
          <h2 className="font-display text-xl md:text-2xl font-bold mb-4">
            {t('contact.title')}
          </h2>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-lg mb-4 border-2 border-white/20">
            <iframe
              src={isRTL 
                ? "https://maps.google.com/maps?q=שדרות+קדש+39+אשקלון+ישראל&t=&z=17&ie=UTF8&iwloc=&output=embed&hl=he"
                : "https://maps.google.com/maps?q=Sderot+Kadesh+39+Ashkelon+Israel&t=&z=17&ie=UTF8&iwloc=&output=embed&hl=en"
              }
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={isRTL ? "מפה - שדרות קדש 39, אשקלון" : "Map - Sderot Kadesh 39, Ashkelon"}
              className="w-full"
            />
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
            <div className="grid gap-3">
              <Input
                placeholder={isRTL ? "שם מלא" : "Full Name"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/90 text-foreground placeholder:text-muted-foreground border-0"
                disabled={isSubmitting}
              />
              <Input
                placeholder={isRTL ? "טלפון" : "Phone"}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/90 text-foreground placeholder:text-muted-foreground border-0"
                disabled={isSubmitting}
              />
              <Textarea
                placeholder={isRTL ? "הודעה..." : "Message..."}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/90 text-foreground placeholder:text-muted-foreground border-0 min-h-[80px]"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-blue-600 hover:bg-white/90 font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2 rtl:mr-0 rtl:ml-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                )}
                {isRTL ? "שלח הודעה" : "Send Message"}
              </Button>
            </div>
          </form>

          {/* Waze Navigation Button */}
          <Button
            onClick={openWaze}
            className="mb-4 bg-[#05c8f7] hover:bg-[#04b5e0] text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <WazeIcon className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2" />
            {isRTL ? "נווט אלינו עם Waze" : "Navigate with Waze"}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-white/90 text-sm hover:scale-105 transition-transform duration-300">
            <Clock className="w-4 h-4" />
            <span>{t('contact.hours')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
