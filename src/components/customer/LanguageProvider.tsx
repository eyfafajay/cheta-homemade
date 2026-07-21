"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ms";

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  getCategoryLabel: (slug: string) => string;
  getCategoryDescription: (slug: string, fallback?: string) => string;
};

const STORAGE_KEY = "cheta_language";

const translations = {
  en: {
    brandTagline: "Cakes • Desserts • Craft",
    navHome: "Home",
    navProducts: "Products",
    navContact: "Contact",
    navAllProducts: "All products",
    navCakes: "Cakes",
    navDesserts: "Desserts",
    navRoti: "Bun",
    navCraft: "Craft",
    languageLabel: "Language",
    menuLabel: "Menu",
    heroEyebrow: "Fresh homemade orders",
    heroTitle: "So delicious, you just can’t stop eating it!",
    heroLead:
      "Cheta Homemade offers homemade cakes, pastries, desserts, buns, and handmade crafts for family gatherings, special celebrations, and sweet little moments.",
    heroBrowse: "Browse products",
    heroContact: "Contact us",
    showcaseTag: "Pre-order available",
    showcaseTitle: "Freshly made treats for every occasion.",
    showcaseBody:
      "Customers can explore products by category, check prices, and contact Cheta Homemade through WhatsApp for orders and any enquiries.",
    showcaseCakesDesc: "Whole cakes and special bakes",
    showcaseDessertsDesc: "Sweet bites for gatherings and gifts",
    showcaseRotiDesc: "Soft homemade buns and savoury breads",
    showcaseCraftDesc: "Handmade items and gifts",
    categoriesEyebrow: "Categories",
    categoriesTitle: "Find what you are looking for",
    categoriesLead: "Browse the menu by category and choose the items that suit your event or daily craving.",
    featuredEyebrow: "Featured menu",
    featuredTitle: "Popular choices",
    featuredButton: "View all products",
    productsEyebrow: "Menu",
    productsTitle: "Products",
    productsLead: "View all available cakes, desserts, buns, and craft items from Cheta Homemade.",
    categoryEyebrow: "Category",
    categoryLead: "Browse items under this category and choose your preferred option.",
    allFilter: "All",
    noProductsTitle: "No products yet",
    noProductsBody: "Products for this section can be added by admin later.",
    available: "Available",
    unavailable: "Unavailable",
    viewDetails: "View details",
    from: "From",
    backToProducts: "Back to products",
    productNotFound: "Product not found",
    productRemoved: "This product may have been removed by admin.",
    priceOptions: "Price options",
    orderViaWhatsApp: "Order via WhatsApp",
    contactDetails: "Contact details",
    contactEyebrow: "Contact Cheta Homemade",
    contactTitle: "Ready to order?",
    contactLead: "Contact us through WhatsApp to check availability, pickup details, and order slots.",
    contactCardTitle: "Order through WhatsApp",
    contactCardBody: "Send us a message and we will help you with ordering details.",
    openWhatsApp: "Open WhatsApp",
    contactInfoTitle: "Contact information",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Phone",
    pickupLabel: "Pickup area",
    businessHoursLabel: "Business hours",
    orderMessageGeneral: "Hi Cheta Homemade, I’m interested to order. May I know what is available?",
    orderMessagePrefix: "Hi Cheta Homemade, I’m interested to order",
    footerBody: "A personal website built for Cheta Homemade to showcase homemade cakes, desserts, buns, and craft items.",
    noticeKicker: "Notice"
  },
  ms: {
    brandTagline: "Kek • Pencuci mulut • Kraf",
    navHome: "Laman Utama",
    navProducts: "Produk",
    navContact: "Hubungi",
    navAllProducts: "Semua produk",
    navCakes: "Kek",
    navDesserts: "Pencuci mulut",
    navRoti: "Roti",
    navCraft: "Kraf",
    languageLabel: "Bahasa",
    menuLabel: "Menu",
    heroEyebrow: "Tempahan homemade",
    heroTitle: "Sedak dooh, tokleh nok tek!",
    heroLead:
      "Cheta Homemade menawarkan kek, pastri, pencuci mulut, roti dan kraftangan buatan sendiri untuk majlis keluarga, sambutan istimewa dan momen-momen manis.",
    heroBrowse: "Lihat produk",
    heroContact: "Hubungi kami",
    showcaseTag: "Tempahan awal tersedia",
    showcaseTitle: "Hidangan segar yang dibuat khas untuk setiap majlis.",
    showcaseBody:
      "Pelanggan boleh melihat produk mengikut kategori, semak harga, dan terus hubungi Cheta Homemade melalui WhatsApp untuk tempahan atau sebarang pertanyaan.",
    showcaseCakesDesc: "Kek penuh dan kek istimewa",
    showcaseDessertsDesc: "Manisan untuk majlis dan hadiah",
    showcaseRotiDesc: "Roti lembut dan roti berperisa",
    showcaseCraftDesc: "Item kraf dan hadiah buatan tangan",
    categoriesEyebrow: "Kategori",
    categoriesTitle: "Cari apa yang anda perlukan",
    categoriesLead: "Lihat menu mengikut kategori dan pilih item yang sesuai untuk majlis atau keinginan harian anda.",
    featuredEyebrow: "Pilihan utama",
    featuredTitle: "Pilihan popular",
    featuredButton: "Lihat semua produk",
    productsEyebrow: "Menu",
    productsTitle: "Produk",
    productsLead: "Lihat semua kek, pencuci mulut, roti, dan item kraf yang tersedia daripada Cheta Homemade.",
    categoryEyebrow: "Kategori",
    categoryLead: "Lihat item di bawah kategori ini dan pilih pilihan yang anda mahu.",
    allFilter: "Semua",
    noProductsTitle: "Belum ada produk",
    noProductsBody: "Produk untuk bahagian ini boleh ditambah oleh admin kemudian.",
    available: "Tersedia",
    unavailable: "Tidak tersedia",
    viewDetails: "Lihat butiran",
    from: "Dari",
    backToProducts: "Kembali ke produk",
    productNotFound: "Produk tidak dijumpai",
    productRemoved: "Produk ini mungkin telah dipadam oleh admin.",
    priceOptions: "Pilihan harga",
    orderViaWhatsApp: "Tempah melalui WhatsApp",
    contactDetails: "Maklumat hubungan",
    contactEyebrow: "Hubungi Cheta Homemade",
    contactTitle: "Sedia untuk membuat tempahan?",
    contactLead: "Hubungi kami melalui WhatsApp untuk semak ketersediaan, maklumat pickup, dan slot tempahan.",
    contactCardTitle: "Tempah melalui WhatsApp",
    contactCardBody: "Hantar mesej kepada kami dan kami akan bantu anda dengan maklumat tempahan.",
    openWhatsApp: "Buka WhatsApp",
    contactInfoTitle: "Maklumat hubungan",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Telefon",
    pickupLabel: "Kawasan pickup",
    businessHoursLabel: "Waktu operasi",
    orderMessageGeneral: "Hi Cheta Homemade, saya berminat untuk membuat tempahan. Boleh saya tahu apa yang tersedia?",
    orderMessagePrefix: "Hi Cheta Homemade, saya berminat untuk menempah",
    footerBody: "Laman web peribadi yang dibina untuk Cheta Homemade bagi memaparkan kek, pencuci mulut, roti, dan item kraf homemade.",
    noticeKicker: "Notis"
  }
} as const;

const categoryLabels: Record<Language, Record<string, string>> = {
  en: {
    kek: "Cakes",
    desserts: "Desserts",
    roti: "Bun",
    craft: "Craft"
  },
  ms: {
    kek: "Kek",
    desserts: "Pencuci mulut",
    roti: "Roti",
    craft: "Kraf"
  }
};

const categoryDescriptions: Record<Language, Record<string, string>> = {
  en: {
    kek: "Homemade cakes for birthdays, family events, and sweet celebrations.",
    desserts: "Creamy, fruity, and bite-sized desserts that are easy to share.",
    roti: "Soft homemade buns and savoury breads for everyday treats.",
    craft: "Handmade craft items that can be updated later by admin."
  },
  ms: {
    kek: "Kek homemade untuk hari lahir, majlis keluarga, dan sambutan istimewa.",
    desserts: "Pencuci mulut yang creamy, fruity, dan mudah dikongsi bersama keluarga atau tetamu.",
    roti: "Roti homemade yang lembut dan bun savouri untuk sajian harian.",
    craft: "Item kraf buatan tangan yang boleh dikemas kini oleh admin kemudian."
  }
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ms");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "en" || saved === "ms") {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
    document.documentElement.lang = language === "ms" ? "ms" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    t: (key) => translations[language][key] ?? translations.en[key],
    getCategoryLabel: (slug) => categoryLabels[language][slug] ?? slug,
    getCategoryDescription: (slug, fallback) => categoryDescriptions[language][slug] ?? fallback ?? slug
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
