import { useState, useEffect } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import AuthModal from "@/components/AuthModal";

// SVG icons with inline styles to prevent Tailwind purging
const StarIconFilled = ({ filled = false, size = 16 }: { filled?: boolean; size?: number }) => (
  <svg 
    style={{ width: `${size}px`, height: `${size}px` }} 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const StarIconWhite = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white', fill: 'white' }} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const SendIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const UserIcon = () => (
  <svg style={{ width: '20px', height: '20px', color: 'white', fill: 'rgba(255,255,255,0.2)' }} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const reviewIconGradient = { background: 'linear-gradient(to bottom right, #f59e0b, #f97316)' };

interface Review {
  id: string;
  cookie_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

const ReviewsSection = () => {
  const { isLoggedIn } = useProfile();
  const { t, isRTL } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCookie, setSelectedCookie] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCookie, setFilterCookie] = useState<string>("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });

  // Cookie options with translation keys
  const cookieOptions = [
    { key: "lotus", he: "לוטוס", en: "Lotus" },
    { key: "kinder", he: "קינדר", en: "Kinder" },
    { key: "kinderBueno", he: "קינדר בואנו", en: "Kinder Bueno" },
    { key: "redVelvet", he: "רד וולווט", en: "Red Velvet" },
    { key: "confetti", he: "קונפטי", en: "Confetti" },
    { key: "pistachio", he: "פיסטוק", en: "Pistachio" },
    { key: "pretzel", he: "בייגלה", en: "Pretzel" },
    { key: "chocolateChip", he: "שוקולד צ׳יפס", en: "Chocolate Chip" },
    { key: "oreo", he: "אוראו", en: "Oreo" },
    { key: "peanutButter", he: "חמאת בוטנים", en: "Peanut Butter" },
    { key: "lemon", he: "לימון", en: "Lemon" },
    { key: "macadamia", he: "מקדמיה", en: "Macadamia" },
    { key: "oatmeal", he: "שיבולת שועל", en: "Oatmeal" },
    { key: "saltedCaramel", he: "קרמל מלוח", en: "Salted Caramel" },
    { key: "tahini", he: "טחינה", en: "Tahini" },
  ];

  const getCookieName = (hebrewName: string) => {
    const cookie = cookieOptions.find(c => c.he === hebrewName);
    return cookie ? (isRTL ? cookie.he : cookie.en) : hebrewName;
  };

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
        title: t('general.error'),
        description: isRTL ? "נא לבחור מוצר" : "Please select a product",
        variant: "destructive",
      });
      return false;
    }

    if (rating === 0) {
      toast({
        title: t('general.error'),
        description: isRTL ? "נא לדרג את המוצר" : "Please rate the product",
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
          title: t('general.error'),
          description: message || (isRTL ? "הביקורת ארוכה מדי" : "Review is too long"),
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
        title: t('reviews.thankYou'),
        description: t('reviews.reviewAdded'),
      });

      setSelectedCookie("");
      setRating(0);
      setReviewText("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: t('general.error'),
        description: isRTL ? "אירעה שגיאה, נסו שוב" : "An error occurred, please try again",
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
      {/* Rich warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/40" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 15% 25%, hsl(40 90% 60% / 0.3) 0%, transparent 45%), radial-gradient(circle at 85% 75%, hsl(25 85% 55% / 0.25) 0%, transparent 50%), radial-gradient(circle at 50% 50%, hsl(35 90% 65% / 0.15) 0%, transparent 55%)' }} />
      {/* Star pattern */}
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 5 L28 18 L42 18 L31 27 L35 40 L25 32 L15 40 L19 27 L8 18 L22 18 Z' fill='%23f59e0b' /%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-6 transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-amber-600 mb-2">
            {t('reviews.title')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.round(Number(averageRating)) ? "text-amber-500" : "text-muted"}>
                    <StarIconFilled filled={star <= Math.round(Number(averageRating))} />
                  </span>
                ))}
              </div>
              <span className="font-bold text-amber-600">{averageRating}</span>
              <span className="text-muted-foreground">({reviews.length} {t('reviews.reviewsCount')})</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Review Form */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/20">
            <h3 className="font-display text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
              <div className="p-2 rounded-xl shadow-md" style={reviewIconGradient}>
                <StarIconWhite />
              </div>
              {t('reviews.addReview')}
            </h3>

            {!isLoggedIn ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('reviews.loginRequired')}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAuthModal(true)}
                >
                  {t('auth.login')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('reviews.selectProduct')}
                  </label>
                  <Select value={selectedCookie} onValueChange={setSelectedCookie}>
                    <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                      <SelectValue placeholder={t('reviews.selectProductPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cookieOptions.map((cookie) => (
                        <SelectItem key={cookie.key} value={cookie.he}>
                          {isRTL ? cookie.he : cookie.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('reviews.rating')}
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <span className={`block transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-amber-500"
                            : "text-muted hover:text-amber-500/50"
                        }`}>
                          <StarIconFilled filled={star <= (hoverRating || rating)} size={32} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('reviews.yourReview')}
                  </label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                    placeholder={t('reviews.reviewPlaceholder')}
                    className={`min-h-[100px] ${isRTL ? 'text-right' : 'text-left'}`}
                    maxLength={500}
                  />
                  <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? 'text-left' : 'text-right'}`}>
                    {reviewText.length}/500
                  </p>
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  {isSubmitting ? (
                    t('reviews.submitting')
                  ) : (
                    <>
                      <span className={isRTL ? 'ml-2' : 'mr-2'}><SendIcon /></span>
                      {t('reviews.submit')}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-amber-600">{t('reviews.recentReviews')}</h3>
              <Select value={filterCookie} onValueChange={setFilterCookie}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={isRTL ? "סנן לפי מוצר" : "Filter by product"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reviews.filterAll')}</SelectItem>
                  {cookieOptions.map((cookie) => (
                    <SelectItem key={cookie.key} value={cookie.he}>
                      {isRTL ? cookie.he : cookie.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={`space-y-4 max-h-[500px] overflow-y-auto ${isRTL ? 'pr-2' : 'pl-2'}`}>
              {filteredReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t('reviews.noReviews')}
                </p>
              ) : (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={reviewIconGradient}>
                        <UserIcon />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-amber-600">{getCookieName(review.cookie_name)}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? "text-amber-500" : "text-muted"}>
                                <StarIconFilled filled={star <= review.rating} />
                              </span>
                            ))}
                          </div>
                        </div>
                        {review.review_text && (
                          <p className="text-muted-foreground text-sm">{review.review_text}</p>
                        )}
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(review.created_at).toLocaleDateString(isRTL ? "he-IL" : "en-US")}
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
