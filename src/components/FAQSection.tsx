import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Truck, CreditCard, Clock, Cookie, AlertTriangle } from "lucide-react";

const faqs = [
  {
    icon: Truck,
    question: "איך עובד המשלוח?",
    answer: "המשלוחים מתבצעים בימים א׳-ה׳ בשעות 10:00-20:00. המשלוח עולה ₪25 לכל הארץ, ומשלוח חינם בהזמנות מעל ₪150. זמן האספקה הוא 1-3 ימי עסקים.",
  },
  {
    icon: CreditCard,
    question: "אילו אמצעי תשלום מקבלים?",
    answer: "כרגע אנחנו מקבלים תשלום במזומן בלבד בעת קבלת המשלוח. בקרוב נוסיף אפשרות לתשלום בכרטיס אשראי.",
  },
  {
    icon: Clock,
    question: "כמה זמן העוגיות נשמרות טריות?",
    answer: "העוגיות שלנו נאפות טריות לכל הזמנה ונשמרות טריות עד 5 ימים בטמפרטורת החדר או עד שבועיים במקרר. מומלץ לחמם במיקרוגל 10 שניות לחוויה מושלמת!",
  },
  {
    icon: AlertTriangle,
    question: "מה לגבי אלרגנים?",
    answer: "כל העוגיות שלנו מכילות גלוטן, חלב וביצים. חלק מהעוגיות מכילות אגוזים, בוטנים או סויה. אם יש לכם אלרגיה מסוימת, אנא ציינו בהערות ההזמנה ונתאים עבורכם.",
  },
  {
    icon: Cookie,
    question: "האם אפשר להזמין לאירועים?",
    answer: "בהחלט! אנחנו מציעים חבילות מיוחדות לאירועים, ימי הולדת, חתונות ובת/בר מצווה. צרו איתנו קשר לקבלת הצעת מחיר מותאמת אישית.",
  },
  {
    icon: HelpCircle,
    question: "איך יוצרים איתכם קשר?",
    answer: "אפשר ליצור קשר דרך הוואטסאפ בכפתור הצף למטה, דרך הטופס באתר, או בטלפון 054-6791198. אנחנו זמינים בימים א׳-ה׳ בין השעות 9:00-21:00.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
            שאלות נפוצות
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            כאן תמצאו תשובות לשאלות הנפוצות ביותר. לא מצאתם מה שחיפשתם? צרו איתנו קשר!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/80 backdrop-blur-sm border border-primary/10 rounded-xl px-4 overflow-hidden"
              >
                <AccordionTrigger className="text-right hover:no-underline py-3 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-full">
                      <faq.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pr-10 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
