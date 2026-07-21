"use client";

import { createClient } from "@/lib/supabase/client";
import type { Category, ContactSettings, Notice, Product, ProductOption } from "@/lib/types";

const PRODUCT_IMAGE_BUCKET = "product-images";

function throwIfError(error: { message: string } | null | undefined) {
  if (error) throw new Error(error.message);
}

function getPublicImageUrl(path?: string | null) {
  if (!path) return undefined;
  const supabase = createClient();
  return supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

function mapCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    nameMs: row.name_ms,
    nameEn: row.name_en,
    descriptionMs: row.description_ms ?? "",
    descriptionEn: row.description_en ?? "",
    sortOrder: row.sort_order ?? 0
  };
}

function mapOption(row: any): ProductOption {
  return {
    id: row.id,
    label: row.label,
    price: Number(row.price ?? 0),
    notes: row.notes || undefined,
    sortOrder: row.sort_order ?? 0
  };
}

function getJoinedCategory(row: any) {
  if (Array.isArray(row.categories)) return row.categories[0];
  return row.categories;
}

function mapProduct(row: any): Product {
  const joinedCategory = getJoinedCategory(row);
  const options = Array.isArray(row.product_options)
    ? [...row.product_options].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(mapOption)
    : [];

  return {
    id: row.id,
    categoryId: row.category_id,
    categorySlug: joinedCategory?.slug ?? "",
    nameMs: row.name_ms,
    nameEn: row.name_en,
    descriptionMs: row.description_ms ?? "",
    descriptionEn: row.description_en ?? "",
    imagePath: row.image_path || undefined,
    imageUrl: getPublicImageUrl(row.image_path),
    isAvailable: Boolean(row.is_available),
    isFeatured: Boolean(row.is_featured),
    options
  };
}

function mapNotice(row: any): Notice {
  return {
    id: row.id,
    titleMs: row.title_ms,
    titleEn: row.title_en,
    messageMs: row.message_ms,
    messageEn: row.message_en,
    isActive: Boolean(row.is_active),
    startDate: row.start_date || undefined,
    endDate: row.end_date || undefined
  };
}

function mapContactSettings(row: any): ContactSettings {
  return {
    id: row.id,
    whatsappNumber: row.whatsapp_number ?? "",
    phoneNumber: row.phone_number ?? "",
    instagramUrl: row.instagram_url ?? "",
    facebookUrl: row.facebook_url ?? "",
    pickupAreaMs: row.pickup_area_ms ?? "",
    pickupAreaEn: row.pickup_area_en ?? "",
    businessHoursMs: row.business_hours_ms ?? "",
    businessHoursEn: row.business_hours_en ?? "",
    orderInstructionsMs: row.order_instructions_ms ?? "",
    orderInstructionsEn: row.order_instructions_en ?? ""
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_ms, name_en, description_ms, description_en, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  throwIfError(error);
  return (data ?? []).map(mapCategory);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_ms, name_en, description_ms, description_en, sort_order")
    .eq("slug", slug)
    .maybeSingle();
  throwIfError(error);
  return data ? mapCategory(data) : undefined;
}

export async function saveCategory(category: Omit<Category, "id"> & { id?: string }): Promise<Category> {
  const supabase = createClient();
  const values = {
    slug: category.slug,
    name_ms: category.nameMs,
    name_en: category.nameEn,
    description_ms: category.descriptionMs,
    description_en: category.descriptionEn,
    sort_order: category.sortOrder
  };

  const query = category.id
    ? supabase.from("categories").update(values).eq("id", category.id)
    : supabase.from("categories").insert(values);

  const { data, error } = await query
    .select("id, slug, name_ms, name_en, description_ms, description_en, sort_order")
    .single();
  throwIfError(error);
  return mapCategory(data);
}

export async function updateCategoryOrder(categories: Category[]) {
  const supabase = createClient();
  const results = await Promise.all(
    categories.map((category, index) =>
      supabase.from("categories").update({ sort_order: index }).eq("id", category.id)
    )
  );
  const error = results.find((result) => result.error)?.error;
  throwIfError(error);
}

export async function deleteCategory(categoryId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  throwIfError(error);
}

const PRODUCT_SELECT = `
  id,
  category_id,
  name_ms,
  name_en,
  description_ms,
  description_en,
  image_path,
  is_available,
  is_featured,
  created_at,
  categories!inner(slug),
  product_options(id, label, price, notes, sort_order)
`;

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapProduct);
}

export async function fetchProductById(productId: string): Promise<Product | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .maybeSingle();
  throwIfError(error);
  return data ? mapProduct(data) : undefined;
}

async function uploadProductImage(productId: string, file: File) {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
  const path = `${productId}/${Date.now()}-${safeBaseName}.${extension}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
  throwIfError(error);
  return path;
}

export async function saveProduct(
  product: Omit<Product, "id" | "categoryId" | "imageUrl"> & { id?: string; categoryId?: string },
  imageFile?: File | null
): Promise<Product> {
  const supabase = createClient();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", product.categorySlug)
    .single();
  throwIfError(categoryError);
  if (!category) throw new Error("Selected category was not found.");

  const values = {
    category_id: category.id,
    name_ms: product.nameMs,
    name_en: product.nameEn,
    description_ms: product.descriptionMs,
    description_en: product.descriptionEn,
    image_path: product.imagePath ?? null,
    is_available: product.isAvailable,
    is_featured: product.isFeatured
  };

  const productQuery = product.id
    ? supabase.from("products").update(values).eq("id", product.id)
    : supabase.from("products").insert(values);

  const { data: savedRow, error: saveError } = await productQuery.select("id, image_path").single();
  throwIfError(saveError);
  if (!savedRow) throw new Error("The product could not be saved.");

  let imagePath = savedRow.image_path as string | null;
  if (imageFile) {
    const oldPath = imagePath;
    imagePath = await uploadProductImage(savedRow.id, imageFile);
    const { error: imageUpdateError } = await supabase
      .from("products")
      .update({ image_path: imagePath })
      .eq("id", savedRow.id);
    throwIfError(imageUpdateError);
    if (oldPath && oldPath !== imagePath) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([oldPath]);
    }
  }

  const { error: deleteOptionsError } = await supabase
    .from("product_options")
    .delete()
    .eq("product_id", savedRow.id);
  throwIfError(deleteOptionsError);

  if (product.options.length > 0) {
    const optionRows = product.options.map((option, index) => ({
      product_id: savedRow.id,
      label: option.label,
      price: option.price,
      notes: option.notes ?? null,
      sort_order: index
    }));
    const { error: optionError } = await supabase.from("product_options").insert(optionRows);
    throwIfError(optionError);
  }

  const savedProduct = await fetchProductById(savedRow.id);
  if (!savedProduct) throw new Error("The product was saved but could not be loaded.");
  return savedProduct;
}

export async function setProductAvailability(productId: string, isAvailable: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", productId);
  throwIfError(error);
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("image_path").eq("id", productId).maybeSingle();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  throwIfError(error);
  if (data?.image_path) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([data.image_path]);
  }
}

export async function fetchNotices(): Promise<Notice[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notices")
    .select("id, title_ms, title_en, message_ms, message_en, is_active, start_date, end_date, created_at")
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapNotice);
}

export async function fetchActiveNotice(): Promise<Notice | undefined> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("notices")
    .select("id, title_ms, title_en, message_ms, message_en, is_active, start_date, end_date")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  throwIfError(error);
  return data ? mapNotice(data) : undefined;
}

export async function createNotice(notice: Omit<Notice, "id">): Promise<Notice> {
  const supabase = createClient();
  if (notice.isActive) {
    const { error: deactivateError } = await supabase.from("notices").update({ is_active: false }).eq("is_active", true);
    throwIfError(deactivateError);
  }

  const { data, error } = await supabase
    .from("notices")
    .insert({
      title_ms: notice.titleMs,
      title_en: notice.titleEn,
      message_ms: notice.messageMs,
      message_en: notice.messageEn,
      is_active: notice.isActive,
      start_date: notice.startDate ?? null,
      end_date: notice.endDate ?? null
    })
    .select("id, title_ms, title_en, message_ms, message_en, is_active, start_date, end_date")
    .single();
  throwIfError(error);
  return mapNotice(data);
}

export async function setActiveNotice(noticeId: string, shouldActivate: boolean) {
  const supabase = createClient();
  if (shouldActivate) {
    const { error: deactivateError } = await supabase.from("notices").update({ is_active: false }).eq("is_active", true);
    throwIfError(deactivateError);
  }
  const { error } = await supabase.from("notices").update({ is_active: shouldActivate }).eq("id", noticeId);
  throwIfError(error);
}

export async function deleteNotice(noticeId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("notices").delete().eq("id", noticeId);
  throwIfError(error);
}

export async function fetchContactSettings(): Promise<ContactSettings | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_settings")
    .select(`
      id,
      whatsapp_number,
      phone_number,
      instagram_url,
      facebook_url,
      pickup_area_ms,
      pickup_area_en,
      business_hours_ms,
      business_hours_en,
      order_instructions_ms,
      order_instructions_en
    `)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  throwIfError(error);
  return data ? mapContactSettings(data) : undefined;
}

export async function saveContactSettings(settings: ContactSettings): Promise<ContactSettings> {
  const supabase = createClient();
  const values = {
    whatsapp_number: settings.whatsappNumber,
    phone_number: settings.phoneNumber,
    instagram_url: settings.instagramUrl || null,
    facebook_url: settings.facebookUrl || null,
    pickup_area_ms: settings.pickupAreaMs,
    pickup_area_en: settings.pickupAreaEn,
    business_hours_ms: settings.businessHoursMs,
    business_hours_en: settings.businessHoursEn,
    order_instructions_ms: settings.orderInstructionsMs,
    order_instructions_en: settings.orderInstructionsEn
  };

  const query = settings.id
    ? supabase.from("contact_settings").update(values).eq("id", settings.id)
    : supabase.from("contact_settings").insert(values);
  const { data, error } = await query
    .select(`
      id,
      whatsapp_number,
      phone_number,
      instagram_url,
      facebook_url,
      pickup_area_ms,
      pickup_area_en,
      business_hours_ms,
      business_hours_en,
      order_instructions_ms,
      order_instructions_en
    `)
    .single();
  throwIfError(error);
  return mapContactSettings(data);
}

export async function getCurrentAdmin() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  throwIfError(error);
  if (!user) return undefined;
  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();
  throwIfError(profileError);
  return profile ? { user, profile } : undefined;
}

export async function signInAdmin(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  throwIfError(error);
  if (!data.user) throw new Error("Login failed.");

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  throwIfError(profileError);
  if (!profile) {
    await supabase.auth.signOut();
    throw new Error("This account is not authorised as an admin.");
  }
  return data.user;
}

export async function signOutAdmin() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  throwIfError(error);
}
