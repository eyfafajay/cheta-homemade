"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/local-store";
import type { Category } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

const icons: Record<string, string> = {
  kek: "🍰",
  desserts: "🧁",
  roti: "🥐",
  craft: "🎀"
};

export function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { getCategoryDescription, getCategoryLabel } = useLanguage();

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Link href={`/products/${category.slug}`} className="category-card" key={category.id}>
          <div className="category-icon">{icons[category.slug] ?? "✨"}</div>
          <h3>{getCategoryLabel(category.slug)}</h3>
          <p className="muted">{getCategoryDescription(category.slug, category.description)}</p>
        </Link>
      ))}
    </div>
  );
}
