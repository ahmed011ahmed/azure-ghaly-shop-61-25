import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.services': 'الخدمات',
    'nav.giveaways': 'المسابقات',
    'nav.chat': 'الدردشة',
    
    // Header
    'header.home': 'الرئيسية',
    'header.tools': 'الأدوات',
    'header.subscribers': 'المشتركين',
    'header.welcome': 'مرحباً،',
    'header.user': 'مستخدم',
    'header.logout': 'خروج',
    'header.login': 'دخول',
    'header.brand': 'GHALY HAX',
    
    // Hero Section
    'hero.gaming.tools': 'أدوات الجيمنج المتقدمة',
    'hero.welcome': 'مرحباً بك في',
    'hero.brand': 'GHALY HAX',
    'hero.description': 'اكتشف أقوى أدوات الهاكينج والبايباس للألعاب - منتجات حصرية لتجربة جيمنج استثنائية',
    'hero.start.playing': '🎮 ابدأ اللعب الآن',
    'hero.join.community': '🏆 انضم للمجتمع',
    'hero.title': 'أدوات الجيمنج المتقدمة',
    'hero.subtitle': 'اكتشف مجموعتنا المتميزة من أدوات الجيمنج الاحترافية',
    'hero.cta': 'تصفح المنتجات',
    
    // Products Section
    'products.title': 'أدواتنا المتميزة',
    'products.subtitle': 'مجموعة شاملة من الأدوات المصممة خصيصاً للاعبين المحترفين',
    'products.addToCart': 'أضف للسلة',
    'products.price': 'السعر:',
    'products.advanced.tools': 'أدوات الجيمنج المتقدمة',
    'products.exclusive.collection': 'مجموعة حصرية من أقوى أدوات الهاكينج والبايباس للجيمرز المحترفين',
    'products.monthly.subscription': '⚡ جميع الأسعار للاشتراك الشهري - ضمان الجودة والأمان',
    'products.loading': 'جاري تحميل المنتجات...',
    'products.get.it': 'احصل عليه',
    
    // Chat Section
    'chat.title': 'تواصل معنا',
    'chat.subtitle': 'فريق الدعم متاح للإجابة على جميع استفساراتك',
    'chat.support': 'دعم العملاء',
    'chat.hello': 'مرحباً',
    'chat.placeholder': 'اكتب رسالتك...',
    'chat.noMessages': 'لا توجد رسائل بعد',
    'chat.loadingMessages': 'جاري تحميل الرسائل...',
    'chat.supportTeam': 'الدعم',
    'chat.you': 'أنت',
    'chat.private': 'خاص',
    'chat.image': '[صورة]:',
    'chat.textImagesLinks': 'النصوص والصور والروابط',
    'chat.loginRequired': 'يجب تسجيل الدخول أولاً للتواصل مع فريق الدعم',
    
    // Auth Page
    'auth.login.title': 'تسجيل الدخول',
    'auth.signup.title': 'إنشاء حساب جديد',
    'auth.login.welcome': 'مرحباً بعودتك!',
    'auth.login.subtitle': 'سجل دخولك للوصول إلى حسابك',
    'auth.signup.welcome': 'انضم إلينا الآن',
    'auth.signup.subtitle': 'أنشئ حساباً جديداً للبدء في التسوق',
    'auth.email': 'البريد الإلكتروني',
    'auth.email.placeholder': 'أدخل بريدك الإلكتروني',
    'auth.nickname': 'النكنيم',
    'auth.nickname.placeholder': 'أدخل النكنيم الخاص بك',
    'auth.password': 'كلمة المرور',
    'auth.password.placeholder': 'أدخل كلمة المرور',
    'auth.login.button': 'تسجيل الدخول',
    'auth.signup.button': 'إنشاء حساب جديد',
    'auth.login.loading': 'جاري تسجيل الدخول...',
    'auth.signup.loading': 'جاري إنشاء الحساب...',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.createAccount': 'إنشاء حساب جديد',
    'auth.loginInstead': 'تسجيل الدخول',
    
    // Error Messages
    'error.nickname.required': 'يرجى إدخال النكنيم',
    'error.email.exists': 'هذا الإيميل مسجل بالفعل. جرب تسجيل الدخول بدلاً من ذلك.',
    'error.signup': 'خطأ في التسجيل',
    'error.login': 'خطأ في تسجيل الدخول',
    'error.credentials': 'الإيميل أو كلمة المرور غير صحيحة',
    'error.unexpected': 'حدث خطأ غير متوقع',
    
    // Success Messages
    'success.accountCreated': 'تم إنشاء الحساب بنجاح!',
    'success.accountCreated.desc': 'تم إنشاء حسابك بنجاح، يمكنك الآن تسجيل الدخول. يرجى ملاحظة أن الوصول لمنطقة المشتركين يتطلب موافقة الإدارة.',
    'success.welcome': 'مرحباً بك!',
    'success.loginSuccess': 'تم تسجيل الدخول بنجاح',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.company': 'GHALY',
    'footer.brand': 'GHALY HAX',
    'footer.description': 'متجرك المتخصص في أدوات الجيمنج المتقدمة. نوفر أقوى الحلول للجيمرز المحترفين مع ضمان الأمان والجودة.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.home': '🏠 الرئيسية',
    'footer.tools': '🎮 الأدوات',
    'footer.contact': 'تواصل معنا',
    'footer.phone': '01010673596',
    'footer.location': 'القاهرة، مصر',
    'footer.copyright': '🎮 جميع الحقوق محفوظة © 2024 GHALY HAX. صُمم للجيمرز المحترفين 🏆',
    
    // Admin
    'admin.login.title': 'تسجيل دخول الإدارة',
    'admin.login.subtitle': 'أدخل بيانات تسجيل الدخول للوصول إلى لوحة التحكم',
    'admin.username': 'اسم المستخدم',
    'admin.username.placeholder': 'أدخل اسم المستخدم',
    'admin.password.placeholder': 'أدخل كلمة المرور',
    'admin.login.button': 'تسجيل الدخول',
    'admin.login.loading': 'جاري تسجيل الدخول...',
    'admin.error.credentials': 'اسم المستخدم أو كلمة المرور غير صحيحة',
    'admin.hint': 'للمطورين فقط - استخدم بيانات الاعتماد المقدمة',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.giveaways': 'Giveaways',
    'nav.chat': 'Chat',
    
    // Header
    'header.home': 'Home',
    'header.tools': 'Tools',
    'header.subscribers': 'Subscribers',
    'header.welcome': 'Welcome,',
    'header.user': 'User',
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.brand': 'GHALY HAX',
    
    // Hero Section
    'hero.gaming.tools': 'Advanced Gaming Tools',
    'hero.welcome': 'Welcome to',
    'hero.brand': 'GHALY HAX',
    'hero.description': 'Discover the most powerful hacking and bypass tools for games - exclusive products for an exceptional gaming experience',
    'hero.start.playing': '🎮 Start Playing Now',
    'hero.join.community': '🏆 Join the Community',
    'hero.title': 'Advanced Gaming Tools',
    'hero.subtitle': 'Discover our premium collection of professional gaming tools',
    'hero.cta': 'Browse Products',
    
    // Products Section
    'products.title': 'Our Premium Tools',
    'products.subtitle': 'A comprehensive collection of tools designed specifically for professional gamers',
    'products.addToCart': 'Add to Cart',
    'products.price': 'Price:',
    'products.advanced.tools': 'Advanced Gaming Tools',
    'products.exclusive.collection': 'Exclusive collection of the most powerful hacking and bypass tools for professional gamers',
    'products.monthly.subscription': '⚡ All prices are for monthly subscription - Quality and security guaranteed',
    'products.loading': 'Loading products...',
    'products.get.it': 'Get It',
    
    // Chat Section
    'chat.title': 'Contact Us',
    'chat.subtitle': 'Our support team is available to answer all your questions',
    'chat.support': 'Customer Support',
    'chat.hello': 'Hello',
    'chat.placeholder': 'Type your message...',
    'chat.noMessages': 'No messages yet',
    'chat.loadingMessages': 'Loading messages...',
    'chat.supportTeam': 'Support',
    'chat.you': 'You',
    'chat.private': 'Private',
    'chat.image': '[Image]:',
    'chat.textImagesLinks': 'Text, images and links',
    'chat.loginRequired': 'You must login first to contact support team',
    
    // Auth Page
    'auth.login.title': 'Login',
    'auth.signup.title': 'Create New Account',
    'auth.login.welcome': 'Welcome Back!',
    'auth.login.subtitle': 'Login to access your account',
    'auth.signup.welcome': 'Join Us Now',
    'auth.signup.subtitle': 'Create a new account to start shopping',
    'auth.email': 'Email',
    'auth.email.placeholder': 'Enter your email',
    'auth.nickname': 'Nickname',
    'auth.nickname.placeholder': 'Enter your nickname',
    'auth.password': 'Password',
    'auth.password.placeholder': 'Enter your password',
    'auth.login.button': 'Login',
    'auth.signup.button': 'Create New Account',
    'auth.login.loading': 'Logging in...',
    'auth.signup.loading': 'Creating account...',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create New Account',
    'auth.loginInstead': 'Login',
    
    // Error Messages
    'error.nickname.required': 'Please enter nickname',
    'error.email.exists': 'This email is already registered. Try logging in instead.',
    'error.signup': 'Signup Error',
    'error.login': 'Login Error',
    'error.credentials': 'Invalid email or password',
    'error.unexpected': 'An unexpected error occurred',
    
    // Success Messages
    'success.accountCreated': 'Account Created Successfully!',
    'success.accountCreated.desc': 'Your account has been created successfully, you can now login. Please note that access to subscribers area requires admin approval.',
    'success.welcome': 'Welcome!',
    'success.loginSuccess': 'Login successful',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.company': 'GHALY',
    'footer.brand': 'GHALY HAX',
    'footer.description': 'Your specialized store for advanced gaming tools. We provide the most powerful solutions for professional gamers with security and quality guarantee.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': '🏠 Home',
    'footer.tools': '🎮 Tools',
    'footer.contact': 'Contact Us',
    'footer.phone': '01010673596',
    'footer.location': 'Cairo, Egypt',
    'footer.copyright': '🎮 All rights reserved © 2024 GHALY HAX. Designed for professional gamers 🏆',
    
    // Admin
    'admin.login.title': 'Admin Login',
    'admin.login.subtitle': 'Enter login credentials to access control panel',
    'admin.username': 'Username',
    'admin.username.placeholder': 'Enter username',
    'admin.password.placeholder': 'Enter password',
    'admin.login.button': 'Login',
    'admin.login.loading': 'Logging in...',
    'admin.error.credentials': 'Invalid username or password',
    'admin.hint': 'For developers only - use provided credentials',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
