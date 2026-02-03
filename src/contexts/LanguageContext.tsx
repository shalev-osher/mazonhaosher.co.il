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
    
    // Cookies Section
    'cookies.title': 'העוגיות שלנו',
    'cookies.subtitle': 'בחרו מהמבחר המיוחד שלנו',
    'cookies.addToCart': 'הוסף לעגלה',
    'cookies.outOfStock': 'אזל מהמלאי',
    'cookies.price': '₪',
    
    // Cookie of the Week
    'cotw.title': 'עוגיית השבוע',
    'cotw.discount': 'הנחה',
    'cotw.originalPrice': 'מחיר מקורי',
    'cotw.salePrice': 'מחיר מבצע',
    
    // About
    'about.title': 'אודות מזון האושר',
    'about.description': 'אנחנו מכינים עוגיות אמריקאיות ענקיות בעבודת יד, עשויות מחומרי הגלם הטובים ביותר. כל עוגייה מוכנת בהזמנה ונאפית בתשומת לב מרבית.',
    
    // Reviews
    'reviews.title': 'מה הלקוחות אומרים',
    'reviews.subtitle': 'ביקורות מלקוחות מרוצים',
    
    // FAQ
    'faq.title': 'שאלות נפוצות',
    'faq.subtitle': 'תשובות לשאלות הנפוצות ביותר',
    
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
    'newsletter.title': 'הצטרפו למועדון',
    'newsletter.subtitle': 'קבלו עדכונים והנחות בלעדיות',
    'newsletter.placeholder': 'הכניסו אימייל',
    'newsletter.button': 'הצטרפו',
    'newsletter.success': 'נרשמת בהצלחה!',
    
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
    
    // Cookies Section
    'cookies.title': 'Our Cookies',
    'cookies.subtitle': 'Choose from our special selection',
    'cookies.addToCart': 'Add to Cart',
    'cookies.outOfStock': 'Out of Stock',
    'cookies.price': '₪',
    
    // Cookie of the Week
    'cotw.title': 'Cookie of the Week',
    'cotw.discount': 'OFF',
    'cotw.originalPrice': 'Original Price',
    'cotw.salePrice': 'Sale Price',
    
    // About
    'about.title': 'About Mazon HaOsher',
    'about.description': 'We craft giant American cookies by hand, using only the finest ingredients. Each cookie is made to order and baked with the utmost care and attention.',
    
    // Reviews
    'reviews.title': 'What Our Customers Say',
    'reviews.subtitle': 'Reviews from happy customers',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to the most common questions',
    
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
    'newsletter.title': 'Join Our Club',
    'newsletter.subtitle': 'Get updates and exclusive discounts',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.button': 'Subscribe',
    'newsletter.success': 'Subscribed successfully!',
    
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
