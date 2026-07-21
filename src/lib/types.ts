export type SiteLanguage = "en" | "ms";

export type Category = {
  id: string;
  slug: string;
  nameMs: string;
  nameEn: string;
  descriptionMs: string;
  descriptionEn: string;
  sortOrder: number;
};

export type ProductOption = {
  id: string;
  label: string;
  price: number;
  notes?: string;
  sortOrder?: number;
};

export type Product = {
  id: string;
  categoryId: string;
  categorySlug: string;
  nameMs: string;
  nameEn: string;
  descriptionMs: string;
  descriptionEn: string;
  imagePath?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  options: ProductOption[];
};

export type Notice = {
  id: string;
  titleMs: string;
  titleEn: string;
  messageMs: string;
  messageEn: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
};

export type ContactSettings = {
  id?: string;
  whatsappNumber: string;
  phoneNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  pickupAreaMs: string;
  pickupAreaEn: string;
  businessHoursMs: string;
  businessHoursEn: string;
  orderInstructionsMs: string;
  orderInstructionsEn: string;
};
