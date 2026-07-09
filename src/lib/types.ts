export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type ProductOption = {
  id: string;
  label: string;
  price: number;
  notes?: string;
};

export type Product = {
  id: string;
  categorySlug: string;
  name: string;
  description: string;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  options: ProductOption[];
};

export type Notice = {
  id: string;
  title: string;
  message: string;
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
};
