export type SiteLanguage = "en" | "ms";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  nameEn?: string;
  nameMs?: string;
  descriptionEn?: string;
  descriptionMs?: string;
  sortOrder?: number;
};

export type ProductOption = {
  id: string;
  label: string;
  price: number;
  notes?: string;
  labelEn?: string;
  labelMs?: string;
  notesEn?: string;
  notesMs?: string;
};

export type Product = {
  id: string;
  categorySlug: string;
  name: string;
  description: string;
  nameEn?: string;
  nameMs?: string;
  descriptionEn?: string;
  descriptionMs?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  options: ProductOption[];
};

export type Notice = {
  id: string;
  title: string;
  message: string;
  titleEn?: string;
  titleMs?: string;
  messageEn?: string;
  messageMs?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
};

export type ContactSettings = {
  whatsappNumber: string;
  phoneNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  pickupArea: string;
  businessHours: string;
  orderInstructions: string;
  pickupAreaEn?: string;
  pickupAreaMs?: string;
  businessHoursEn?: string;
  businessHoursMs?: string;
  orderInstructionsEn?: string;
  orderInstructionsMs?: string;
};
