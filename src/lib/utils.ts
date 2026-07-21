import type {
  Category,
  ContactSettings,
  Notice,
  Product,
  ProductOption,
  SiteLanguage
} from "./types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(price: number) {
  if (price <= 0) return "Price TBA";
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2
  }).format(price);
}

export function getProductStartingPrice(product: Product) {
  const validPrices = product.options.map((option) => option.price).filter((price) => price > 0);
  if (!validPrices.length) return "Price TBA";
  return `From ${formatPrice(Math.min(...validPrices))}`;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string) {
  const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
  return cleanedNumber ? `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}` : "#";
}

export function getLocalizedCategoryName(category: Category, language: SiteLanguage) {
  return language === "ms" ? category.nameMs : category.nameEn;
}

export function getLocalizedCategoryDescription(category: Category, language: SiteLanguage) {
  return language === "ms" ? category.descriptionMs : category.descriptionEn;
}

export function getLocalizedProductName(product: Product, language: SiteLanguage) {
  return language === "ms" ? product.nameMs : product.nameEn;
}

export function getLocalizedProductDescription(product: Product, language: SiteLanguage) {
  return language === "ms" ? product.descriptionMs : product.descriptionEn;
}

export function getLocalizedOptionLabel(option: ProductOption) {
  return option.label;
}

export function getLocalizedOptionNotes(option: ProductOption) {
  return option.notes;
}

export function getLocalizedNoticeTitle(notice: Notice, language: SiteLanguage) {
  return language === "ms" ? notice.titleMs : notice.titleEn;
}

export function getLocalizedNoticeMessage(notice: Notice, language: SiteLanguage) {
  return language === "ms" ? notice.messageMs : notice.messageEn;
}

export function getLocalizedPickupArea(settings: ContactSettings, language: SiteLanguage) {
  return language === "ms" ? settings.pickupAreaMs : settings.pickupAreaEn;
}

export function getLocalizedBusinessHours(settings: ContactSettings, language: SiteLanguage) {
  return language === "ms" ? settings.businessHoursMs : settings.businessHoursEn;
}

export function getLocalizedOrderInstructions(settings: ContactSettings, language: SiteLanguage) {
  return language === "ms" ? settings.orderInstructionsMs : settings.orderInstructionsEn;
}
