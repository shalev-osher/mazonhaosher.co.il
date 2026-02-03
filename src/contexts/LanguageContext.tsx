import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  he: {
    // Header
    'nav.home': 'בית',
    'nav.cookies': 'עוגיות',
    'nav.about': 'אודות',
    'nav.reviews': 'ביקורות',
    'nav.faq': 'שאלות נפוצות',
    'nav.contact': 'צור קשר',
    'nav.cart': 'עגלה',
    'nav.profile': 'פרופיל',
    'nav.login': 'התחברות',
    'nav.logout': 'התנתקות',
    'nav.orderHistory': 'היסטוריית הזמנות',
    'nav.editProfile': 'עריכת פרופיל',
    
    // Hero
    'hero.title': 'מזון האושר',
    'hero.subtitle': 'עוגיות אמריקאיות ענקיות',
    'hero.description': 'עוגיות אמריקאיות ענקיות בעבודת יד, עשויות מחומרי הגלם הטובים ביותר',
    'hero.cta': 'לתפריט העוגיות',
    'hero.madeWithLove': 'מיוצר באהבה',
    'hero.viewMenu': 'צפו בתפריט',
    
    // Cookies Section
    'cookies.title': 'הקולקציה שלנו',
    'cookies.subtitle': 'מיוצר באהבה, במיוחד בשבילכם ✨',
    'cookies.addToCart': 'הוסף לעגלה',
    'cookies.outOfStock': 'אזל מהמלאי',
    'cookies.price': '₪',
    'cookies.search': 'חיפוש...',
    'cookies.all': 'הכל',
    'cookies.chocolate': 'שוקולד',
    'cookies.fruits': 'פירות',
    'cookies.candy': 'ממתקים',
    'cookies.nuts': 'אגוזים',
    'cookies.classic': 'קלאסי',
    'cookies.recommended': 'מומלץ',
    'cookies.new': 'חדש',
    'cookies.favorites': 'מועדפים',
    'cookies.sortDefault': 'ברירת מחדל',
    'cookies.sortName': 'לפי שם',
    'cookies.sortPrice': 'לפי מחיר',
    'cookies.noResults': 'לא נמצאו עוגיות',
    'cookies.clearFilters': 'נקה מסננים',
    
    // Cookie names
    'cookie.lotus': 'לוטוס',
    'cookie.kinder': 'קינדר',
    'cookie.kinderBueno': 'קינדר בואנו',
    'cookie.redVelvet': 'רד וולווט',
    'cookie.confetti': 'קונפטי',
    'cookie.pistachio': 'פיסטוק',
    'cookie.pretzel': 'בייגלה',
    'cookie.chocolateChip': 'שוקולד צ׳יפס',
    'cookie.oreo': 'אוראו',
    'cookie.peanutButter': 'חמאת בוטנים',
    'cookie.lemon': 'לימון',
    'cookie.macadamia': 'מקדמיה',
    'cookie.oatmeal': 'שיבולת שועל',
    'cookie.saltedCaramel': 'קרמל מלוח',
    'cookie.tahini': 'טחינה',
    
    // Cookie descriptions
    'cookie.lotusDesc': 'ביסקוויט לוטוס וממרח קרמל',
    'cookie.kinderDesc': 'שוקולד קינדר וכדורי שוקולד צבעוניים',
    'cookie.kinderBuenoDesc': 'קינדר בואנו, שוקולד חלב וציפוי שוקולד',
    'cookie.redVelvetDesc': 'בצק רד וולווט, שוקולד לבן ופירורי פטל',
    'cookie.confettiDesc': 'סוכריות צבעוניות וסמארטיז',
    'cookie.pistachioDesc': 'שוקולד לבן, פיסטוקים קלויים וגרגירי רימון',
    'cookie.pretzelDesc': 'בייגלה מלוח, שוקולד לבן וצ׳יפס שוקולד',
    'cookie.chocolateChipDesc': 'צ׳יפס שוקולד בלגי מריר ושוקולד חלב',
    'cookie.oreoDesc': 'פירורי אוראו, שוקולד לבן וקרם וניל',
    'cookie.peanutButterDesc': 'חמאת בוטנים, בוטנים קלויים ושוקולד',
    'cookie.lemonDesc': 'גרידת לימון טרי וציפוי סוכר',
    'cookie.macadamiaDesc': 'אגוזי מקדמיה ושוקולד לבן',
    'cookie.oatmealDesc': 'שיבולת שועל, צימוקים וקינמון',
    'cookie.saltedCaramelDesc': 'קרמל ביתי וקריסטלי מלח ים',
    'cookie.tahiniDesc': 'טחינה גולמית, שומשום ודבש',
    
    // Cookie of the Week
    'cotw.title': 'עוגיית השבוע',
    'cotw.discount': 'הנחה',
    'cotw.originalPrice': 'מחיר מקורי',
    'cotw.salePrice': 'מחיר מבצע',
    
    // About
    'about.title': 'אודות מזון האושר',
    'about.ourStory': 'הסיפור שלנו',
    'about.headline': 'יוצרים אושר, יצירה אחת בכל פעם',
    'about.description': 'מזון האושר התחיל במטבח ביתי קטן עם חלום פשוט: לשתף את החום והנוחות של מאפים ביתיים עם הקהילה שלנו.',
    'about.madeWithLove': 'מיוצר באהבה',
    'about.madeWithLoveDesc': 'כל אצווה מוכנה בקפידה ובתשוקה, בדיוק כמו שסבתא הייתה עושה.',
    'about.freshIngredients': 'מרכיבים טריים',
    'about.freshIngredientsDesc': 'אנחנו מקפידים רק על המרכיבים הטריים והמשובחים ביותר.',
    'about.dailyPrep': 'הכנה יומית',
    'about.dailyPrepDesc': 'המוצרים שלנו מוכנים טריים כל בוקר לטעם מושלם.',
    
    // Reviews
    'reviews.title': 'מה הלקוחות אומרים',
    'reviews.subtitle': 'ביקורות מלקוחות מרוצים',
    'reviews.addReview': 'הוסיפו ביקורת',
    'reviews.selectProduct': 'בחרו מוצר',
    'reviews.selectProductPlaceholder': 'בחרו מוצר...',
    'reviews.rating': 'דירוג',
    'reviews.yourReview': 'הביקורת שלכם (אופציונלי, עד 500 תווים)',
    'reviews.reviewPlaceholder': 'ספרו לנו מה חשבתם...',
    'reviews.submit': 'לשלוח ביקורת',
    'reviews.submitting': 'שולח...',
    'reviews.loginRequired': 'כדי לכתוב ביקורת צריך להתחבר',
    'reviews.recentReviews': 'ביקורות אחרונות',
    'reviews.filterAll': 'כל המוצרים',
    'reviews.noReviews': 'אין עדיין ביקורות. היו הראשונים לכתוב ביקורת!',
    'reviews.thankYou': 'תודה על הביקורת! 🍪',
    'reviews.reviewAdded': 'הביקורת שלך נוספה בהצלחה',
    'reviews.reviewsCount': 'ביקורות',
    
    // FAQ
    'faq.title': 'שאלות נפוצות',
    'faq.subtitle': 'כאן תמצאו תשובות לשאלות הנפוצות ביותר. לא מצאתם מה שחיפשתם? צרו איתנו קשר!',
    'faq.delivery': 'איך עובד המשלוח?',
    'faq.deliveryAnswer': 'המשלוחים מתבצעים בימים א׳-ה׳ בשעות 10:00-20:00. המשלוח עולה ₪25 לכל הארץ, ומשלוח חינם בהזמנות מעל ₪150. זמן האספקה הוא 1-3 ימי עסקים.',
    'faq.payment': 'אילו אמצעי תשלום מקבלים?',
    'faq.paymentAnswer': 'כרגע אנחנו מקבלים תשלום במזומן בלבד בעת קבלת המשלוח. בקרוב נוסיף אפשרות לתשלום בכרטיס אשראי.',
    'faq.freshness': 'כמה זמן המוצרים נשמרים טריים?',
    'faq.freshnessAnswer': 'המוצרים שלנו מוכנים טריים לכל הזמנה ונשמרים טריים עד 5 ימים בטמפרטורת החדר או עד שבועיים במקרר. מומלץ לחמם במיקרוגל 10 שניות לחוויה מושלמת!',
    'faq.allergens': 'מה לגבי אלרגנים?',
    'faq.allergensAnswer': 'כל העוגיות שלנו מכילות גלוטן, חלב וביצים. חלק מהעוגיות מכילות אגוזים, בוטנים או סויה. אם יש לכם אלרגיה מסוימת, אנא ציינו בהערות ההזמנה ונתאים עבורכם.',
    'faq.events': 'האם אפשר להזמין לאירועים?',
    'faq.eventsAnswer': 'בהחלט! אנחנו מציעים חבילות מיוחדות לאירועים, ימי הולדת, חתונות ובת/בר מצווה. צרו איתנו קשר לקבלת הצעת מחיר מותאמת אישית.',
    'faq.contact': 'איך יוצרים איתכם קשר?',
    'faq.contactAnswer': 'אפשר ליצור קשר דרך הוואטסאפ בכפתור הצף למטה, דרך הטופס באתר, או בטלפון 054-6791198. אנחנו זמינים בימים א׳-ה׳ בין השעות 9:00-21:00.',
    
    // Contact
    'contact.title': 'צרו קשר',
    'contact.address': 'שדרות קדש 39, אשקלון',
    'contact.phone': '054-679-1198',
    'contact.hours': 'אספקה עד 3 ימי עסקים',
    
    // Cart
    'cart.title': 'העגלה שלך',
    'cart.empty': 'העגלה ריקה',
    'cart.total': 'סה"כ',
    'cart.checkout': 'לתשלום',
    'cart.remove': 'הסר',
    'cart.quantity': 'כמות',
    'cart.subtotal': 'סכום ביניים',
    'cart.shipping': 'משלוח',
    'cart.free': 'חינם',
    
    // Checkout
    'checkout.title': 'פרטי הזמנה',
    'checkout.name': 'שם מלא',
    'checkout.phone': 'טלפון',
    'checkout.address': 'כתובת',
    'checkout.city': 'עיר',
    'checkout.notes': 'הערות להזמנה',
    'checkout.submit': 'שלח הזמנה',
    'checkout.success': 'ההזמנה נשלחה בהצלחה!',
    
    // Auth
    'auth.login': 'התחברות',
    'auth.signup': 'הרשמה',
    'auth.email': 'אימייל',
    'auth.password': 'סיסמה',
    'auth.forgotPassword': 'שכחת סיסמה?',
    'auth.noAccount': 'אין לך חשבון?',
    'auth.hasAccount': 'יש לך חשבון?',
    'auth.loginButton': 'התחבר',
    'auth.signupButton': 'הירשם',
    'auth.orContinueWith': 'או המשך עם',
    'auth.phoneLogin': 'התחברות עם טלפון',
    'auth.sendCode': 'שלח קוד',
    'auth.verifyCode': 'אמת קוד',
    
    // Profile
    'profile.title': 'הפרופיל שלי',
    'profile.edit': 'ערוך פרופיל',
    'profile.save': 'שמור',
    'profile.cancel': 'ביטול',
    'profile.deleteAccount': 'מחיקת חשבון',
    'profile.changePassword': 'שנה סיסמה',
    
    // Newsletter
    'newsletter.title': 'לא לפספס מבצעים!',
    'newsletter.subtitle': 'הירשמו לניוזלטר וקבלו עדכונים על מבצעים מיוחדים',
    'newsletter.emailPlaceholder': 'כתובת המייל שלך',
    'newsletter.phonePlaceholder': 'מספר טלפון (אופציונלי)',
    'newsletter.button': 'להירשם לעדכונים ✨',
    'newsletter.submitting': 'שולח...',
    'newsletter.success': 'נרשמת בהצלחה! 🎉',
    'newsletter.successDesc': 'תקבל/י עדכונים על מבצעים וחדשות',
    'newsletter.thankYou': 'תודה שנרשמת! ✨',
    'newsletter.thankYouDesc': 'נעדכן אותך על מבצעים מיוחדים, מוצרים חדשים והפתעות מתוקות',
    'newsletter.noSpam': 'אנחנו מבטיחים לא לשלוח ספאם. רק טוב טעים. ✨',
    
    // Footer
    'footer.rights': 'כל הזכויות שמורות',
    'footer.privacy': 'מדיניות פרטיות',
    'footer.terms': 'תנאי שימוש',
    
    // General
    'general.loading': 'טוען...',
    'general.error': 'שגיאה',
    'general.success': 'הצלחה',
    'general.close': 'סגור',
    'general.back': 'חזרה',
    'general.next': 'הבא',
    'general.confirm': 'אישור',
    'general.delete': 'מחק',
    'general.edit': 'ערוך',
    'general.save': 'שמור',
    'general.cancel': 'ביטול',
    
    // Gift Package
    'gift.title': 'בניית מארז מתנה',
    'gift.selectCookies': 'בחרו עוגיות למארז',
    'gift.packageName': 'שם המארז',
    'gift.addToCart': 'הוסף מארז לעגלה',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.cookies': 'Cookies',
    'nav.about': 'About',
    'nav.reviews': 'Reviews',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.orderHistory': 'Order History',
    'nav.editProfile': 'Edit Profile',
    
    // Hero
    'hero.title': 'Mazon HaOsher',
    'hero.subtitle': 'Giant American Cookies',
    'hero.description': 'Handcrafted giant American cookies made from the finest ingredients',
    'hero.cta': 'View Our Cookies',
    'hero.madeWithLove': 'Made with Love',
    'hero.viewMenu': 'View Menu',
    
    // Cookies Section
    'cookies.title': 'Our Collection',
    'cookies.subtitle': 'Made with love, especially for you ✨',
    'cookies.addToCart': 'Add to Cart',
    'cookies.outOfStock': 'Out of Stock',
    'cookies.price': '₪',
    'cookies.search': 'Search...',
    'cookies.all': 'All',
    'cookies.chocolate': 'Chocolate',
    'cookies.fruits': 'Fruits',
    'cookies.candy': 'Candy',
    'cookies.nuts': 'Nuts',
    'cookies.classic': 'Classic',
    'cookies.recommended': 'Recommended',
    'cookies.new': 'New',
    'cookies.favorites': 'Favorites',
    'cookies.sortDefault': 'Default',
    'cookies.sortName': 'By Name',
    'cookies.sortPrice': 'By Price',
    'cookies.noResults': 'No cookies found',
    'cookies.clearFilters': 'Clear filters',
    
    // Cookie names
    'cookie.lotus': 'Lotus',
    'cookie.kinder': 'Kinder',
    'cookie.kinderBueno': 'Kinder Bueno',
    'cookie.redVelvet': 'Red Velvet',
    'cookie.confetti': 'Confetti',
    'cookie.pistachio': 'Pistachio',
    'cookie.pretzel': 'Pretzel',
    'cookie.chocolateChip': 'Chocolate Chip',
    'cookie.oreo': 'Oreo',
    'cookie.peanutButter': 'Peanut Butter',
    'cookie.lemon': 'Lemon',
    'cookie.macadamia': 'Macadamia',
    'cookie.oatmeal': 'Oatmeal',
    'cookie.saltedCaramel': 'Salted Caramel',
    'cookie.tahini': 'Tahini',
    
    // Cookie descriptions
    'cookie.lotusDesc': 'Lotus biscuit and caramel spread',
    'cookie.kinderDesc': 'Kinder chocolate with colorful chocolate balls',
    'cookie.kinderBuenoDesc': 'Kinder Bueno, milk chocolate and chocolate coating',
    'cookie.redVelvetDesc': 'Red velvet dough, white chocolate and raspberry crumbs',
    'cookie.confettiDesc': 'Colorful sprinkles and Smarties',
    'cookie.pistachioDesc': 'White chocolate, roasted pistachios and pomegranate seeds',
    'cookie.pretzelDesc': 'Salted pretzel, white chocolate and chocolate chips',
    'cookie.chocolateChipDesc': 'Belgian dark and milk chocolate chips',
    'cookie.oreoDesc': 'Oreo crumbs, white chocolate and vanilla cream',
    'cookie.peanutButterDesc': 'Peanut butter, roasted peanuts and chocolate',
    'cookie.lemonDesc': 'Fresh lemon zest with sugar coating',
    'cookie.macadamiaDesc': 'Macadamia nuts and white chocolate',
    'cookie.oatmealDesc': 'Oatmeal, raisins and cinnamon',
    'cookie.saltedCaramelDesc': 'Homemade caramel with sea salt crystals',
    'cookie.tahiniDesc': 'Raw tahini, sesame seeds and honey',
    
    // Cookie of the Week
    'cotw.title': 'Cookie of the Week',
    'cotw.discount': 'OFF',
    'cotw.originalPrice': 'Original Price',
    'cotw.salePrice': 'Sale Price',
    
    // About
    'about.title': 'About Mazon HaOsher',
    'about.ourStory': 'Our Story',
    'about.headline': 'Creating happiness, one creation at a time',
    'about.description': 'Mazon HaOsher started in a small home kitchen with a simple dream: to share the warmth and comfort of homemade baked goods with our community.',
    'about.madeWithLove': 'Made with Love',
    'about.madeWithLoveDesc': 'Every batch is prepared with care and passion, just like grandma used to make.',
    'about.freshIngredients': 'Fresh Ingredients',
    'about.freshIngredientsDesc': 'We use only the freshest and finest ingredients.',
    'about.dailyPrep': 'Daily Preparation',
    'about.dailyPrepDesc': 'Our products are freshly prepared every morning for perfect taste.',
    
    // Reviews
    'reviews.title': 'What Our Customers Say',
    'reviews.subtitle': 'Reviews from happy customers',
    'reviews.addReview': 'Add a Review',
    'reviews.selectProduct': 'Select a product',
    'reviews.selectProductPlaceholder': 'Select a product...',
    'reviews.rating': 'Rating',
    'reviews.yourReview': 'Your review (optional, up to 500 characters)',
    'reviews.reviewPlaceholder': 'Tell us what you thought...',
    'reviews.submit': 'Submit Review',
    'reviews.submitting': 'Submitting...',
    'reviews.loginRequired': 'You need to log in to write a review',
    'reviews.recentReviews': 'Recent Reviews',
    'reviews.filterAll': 'All Products',
    'reviews.noReviews': 'No reviews yet. Be the first to write a review!',
    'reviews.thankYou': 'Thanks for your review! 🍪',
    'reviews.reviewAdded': 'Your review has been added successfully',
    'reviews.reviewsCount': 'reviews',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': "Here you'll find answers to the most common questions. Didn't find what you're looking for? Contact us!",
    'faq.delivery': 'How does delivery work?',
    'faq.deliveryAnswer': 'Deliveries are made Sunday-Thursday, 10:00-20:00. Shipping costs ₪25 nationwide, free shipping on orders over ₪150. Delivery time is 1-3 business days.',
    'faq.payment': 'What payment methods do you accept?',
    'faq.paymentAnswer': 'Currently we accept cash payment upon delivery only. Credit card payment will be added soon.',
    'faq.freshness': 'How long do the products stay fresh?',
    'faq.freshnessAnswer': 'Our products are freshly made for each order and stay fresh for up to 5 days at room temperature or up to two weeks in the refrigerator. We recommend heating in the microwave for 10 seconds for the perfect experience!',
    'faq.allergens': 'What about allergens?',
    'faq.allergensAnswer': 'All our cookies contain gluten, dairy and eggs. Some cookies contain nuts, peanuts or soy. If you have a specific allergy, please note it in your order and we will accommodate you.',
    'faq.events': 'Can I order for events?',
    'faq.eventsAnswer': 'Absolutely! We offer special packages for events, birthdays, weddings and bar/bat mitzvahs. Contact us for a personalized quote.',
    'faq.contact': 'How can I contact you?',
    'faq.contactAnswer': 'You can contact us via WhatsApp using the floating button below, through the website form, or by phone at 054-6791198. We are available Sunday-Thursday between 9:00-21:00.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.address': '39 Kadesh Blvd, Ashkelon',
    'contact.phone': '054-679-1198',
    'contact.hours': 'Delivery within 3 business days',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    
    // Checkout
    'checkout.title': 'Order Details',
    'checkout.name': 'Full Name',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.notes': 'Order Notes',
    'checkout.submit': 'Place Order',
    'checkout.success': 'Order placed successfully!',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginButton': 'Log In',
    'auth.signupButton': 'Sign Up',
    'auth.orContinueWith': 'Or continue with',
    'auth.phoneLogin': 'Login with Phone',
    'auth.sendCode': 'Send Code',
    'auth.verifyCode': 'Verify Code',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.deleteAccount': 'Delete Account',
    'profile.changePassword': 'Change Password',
    
    // Newsletter
    'newsletter.title': "Don't Miss Out!",
    'newsletter.subtitle': 'Subscribe to our newsletter for special offers',
    'newsletter.emailPlaceholder': 'Your email address',
    'newsletter.phonePlaceholder': 'Phone number (optional)',
    'newsletter.button': 'Subscribe for updates ✨',
    'newsletter.submitting': 'Submitting...',
    'newsletter.success': 'Subscribed successfully! 🎉',
    'newsletter.successDesc': "You'll receive updates on deals and news",
    'newsletter.thankYou': 'Thanks for subscribing! ✨',
    'newsletter.thankYouDesc': "We'll update you on special deals, new products and sweet surprises",
    'newsletter.noSpam': "We promise not to send spam. Only delicious updates. ✨",
    
    // Footer
    'footer.rights': 'All Rights Reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.success': 'Success',
    'general.close': 'Close',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.confirm': 'Confirm',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    
    // Gift Package
    'gift.title': 'Build a Gift Package',
    'gift.selectCookies': 'Select cookies for the package',
    'gift.packageName': 'Package Name',
    'gift.addToCart': 'Add Package to Cart',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'he';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    // Update document direction and lang
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'he';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
