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
import { useLanguage } from "@/contexts/LanguageContext";
import AuthModal from "@/components/AuthModal";

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
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-background to-orange-500/10" />
      
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
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(Number(averageRating))
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted"
                    }`}
                  />
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
              <Star className="h-4 w-4 text-amber-500" />
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
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted hover:text-amber-500/50"
                          }`}
                        />
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
                      <Send className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
                      <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-amber-600">{getCookieName(review.cookie_name)}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-amber-500 fill-amber-500"
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
