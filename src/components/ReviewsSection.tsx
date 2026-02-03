import { useState, useEffect } from "react";
import { Star, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { reviewTextSchema, getValidationError } from "@/lib/validation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProfile } from "@/contexts/ProfileContext";
import AuthModal from "@/components/AuthModal";
const cookieOptions = [
  "לוטוס", "קינדר", "קינדר בואנו", "רד וולווט", "קונפטי", "פיסטוק",
  "בייגלה", "שוקולד צ׳יפס", "אוראו", "חמאת בוטנים", "לימון", "מקדמיה",
  "שיבולת שועל", "קרמל מלוח", "טחינה"
];

interface Review {
  id: string;
  cookie_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

const ReviewsSection = () => {
  const { isLoggedIn } = useProfile();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCookie, setSelectedCookie] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCookie, setFilterCookie] = useState<string>("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("cookie_reviews")
      .select("id, cookie_name, rating, review_text, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data && !error) {
      setReviews(data);
    }
  };

  const validateReview = (): boolean => {
    if (!selectedCookie) {
      toast({
        title: "שגיאה",
        description: "נא לבחור מוצר",
        variant: "destructive",
      });
      return false;
    }

    if (rating === 0) {
      toast({
        title: "שגיאה",
        description: "נא לדרג את המוצר",
        variant: "destructive",
      });
      return false;
    }

    // Validate review text length
    if (reviewText) {
      try {
        reviewTextSchema.parse(reviewText);
      } catch (error) {
        const message = getValidationError(error);
        toast({
          title: "שגיאה",
          description: message || "הביקורת ארוכה מדי",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!validateReview()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("cookie_reviews").insert({
        cookie_name: selectedCookie,
        rating,
        review_text: reviewText.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "תודה על הביקורת! 🍪",
        description: "הביקורת שלך נוספה בהצלחה",
      });

      setSelectedCookie("");
      setRating(0);
      setReviewText("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה, נסו שוב",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = filterCookie === "all" 
    ? reviews 
    : reviews.filter(r => r.cookie_name === filterCookie);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <section id="reviews" ref={sectionRef} className="py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-secondary/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-6 transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
            מה הלקוחות אומרים
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(Number(averageRating))
                      ? "text-accent fill-accent"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-primary">{averageRating}</span>
            <span className="text-muted-foreground">({reviews.length} ביקורות)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Review Form */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
            <h3 className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              הוסיפו ביקורת
            </h3>

            {!isLoggedIn ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  כדי לכתוב ביקורת צריך להתחבר
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAuthModal(true)}
                >
                  התחברות
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-right">בחרו מוצר</label>
                  <Select value={selectedCookie} onValueChange={setSelectedCookie}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחרו מוצר..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cookieOptions.map((cookie) => (
                        <SelectItem key={cookie} value={cookie}>
                          {cookie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-right">דירוג</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-accent fill-accent"
                              : "text-muted hover:text-accent/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-right">
                    הביקורת שלכם (אופציונלי, עד 500 תווים)
                  </label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                    placeholder="ספרו לנו מה חשבתם..."
                    className="min-h-[100px] text-right"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-left">
                    {reviewText.length}/500
                  </p>
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    "שולח..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      לשלוח ביקורת
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-primary">ביקורות אחרונות</h3>
              <Select value={filterCookie} onValueChange={setFilterCookie}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="סנן לפי מוצר" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המוצרים</SelectItem>
                  {cookieOptions.map((cookie) => (
                    <SelectItem key={cookie} value={cookie}>
                      {cookie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  אין עדיין ביקורות. היו הראשונים לכתוב ביקורת!
                </p>
              ) : (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-primary/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-primary">{review.cookie_name}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-accent fill-accent"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.review_text && (
                          <p className="text-muted-foreground text-sm">{review.review_text}</p>
                        )}
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(review.created_at).toLocaleDateString("he-IL")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </section>
  );
};

export default ReviewsSection;
