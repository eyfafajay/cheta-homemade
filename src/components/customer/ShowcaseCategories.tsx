"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/data";
import { getLocalizedCategoryDescription, getLocalizedCategoryName } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

const icons: Record<string, string> = {
  kek: "🍰",
  desserts: "🧁",
  roti: "🥐",
  craft: "🎀"
};

export function ShowcaseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    void fetchCategories().then((items) => setCategories(items.slice(0, 4))).catch(console.error);
  }, []);

  if (!categories.length) return null;

  return (
    <div className="showcase-category-grid">
      {categories.map((category) => (
        <Link className="showcase-category" href={`/products/${category.slug}`} key={category.id}>
          <span>{icons[category.slug] ?? "✨"}</span>
          <strong>{getLocalizedCategoryName(category, language)}</strong>
          <small>{getLocalizedCategoryDescription(category, language)}</small>
        </Link>
      ))}
    </div>
  );
}
