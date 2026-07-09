"use client";

import { defaultCategories, defaultContactSettings, defaultNotices, defaultProducts } from "./mock-data";
import type { Category, ContactSettings, Notice, Product } from "./types";

const PRODUCTS_KEY = "cheta_products";
const CATEGORIES_KEY = "cheta_categories";
const NOTICES_KEY = "cheta_notices";
const CONTACT_KEY = "cheta_contact_settings";
const ADMIN_SESSION_KEY = "cheta_admin_session";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getProducts(): Product[] {
  if (!isBrowser()) return defaultProducts;
  return safeParse<Product[]>(localStorage.getItem(PRODUCTS_KEY), defaultProducts);
}

export function saveProducts(products: Product[]) {
  if (!isBrowser()) return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getProductById(productId: string): Product | undefined {
  return getProducts().find((product) => product.id === productId);
}

export function upsertProduct(product: Product) {
  const products = getProducts();
  const exists = products.some((item) => item.id === product.id);
  const nextProducts = exists
    ? products.map((item) => (item.id === product.id ? product : item))
    : [product, ...products];
  saveProducts(nextProducts);
}

export function deleteProduct(productId: string) {
  saveProducts(getProducts().filter((product) => product.id !== productId));
}

export function getCategories(): Category[] {
  if (!isBrowser()) return defaultCategories;
  return safeParse<Category[]>(localStorage.getItem(CATEGORIES_KEY), defaultCategories);
}

export function saveCategories(categories: Category[]) {
  if (!isBrowser()) return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function getNotices(): Notice[] {
  if (!isBrowser()) return defaultNotices;
  return safeParse<Notice[]>(localStorage.getItem(NOTICES_KEY), defaultNotices);
}

export function saveNotices(notices: Notice[]) {
  if (!isBrowser()) return;
  localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
}

export function getActiveNotice(): Notice | undefined {
  return getNotices().find((notice) => notice.isActive);
}

export function getContactSettings(): ContactSettings {
  if (!isBrowser()) return defaultContactSettings;
  return safeParse<ContactSettings>(localStorage.getItem(CONTACT_KEY), defaultContactSettings);
}

export function saveContactSettings(settings: ContactSettings) {
  if (!isBrowser()) return;
  localStorage.setItem(CONTACT_KEY, JSON.stringify(settings));
}

export function loginAdmin() {
  if (!isBrowser()) return;
  localStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function logoutAdmin() {
  if (!isBrowser()) return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn() {
  if (!isBrowser()) return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function resetDemoData() {
  if (!isBrowser()) return;
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
  localStorage.removeItem(NOTICES_KEY);
  localStorage.removeItem(CONTACT_KEY);
}

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
  return `https://wa.me/${cleanedNumber || "60XXXXXXXXX"}?text=${encodeURIComponent(message)}`;
}
