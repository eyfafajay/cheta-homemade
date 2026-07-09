"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/local-store";
import type { Category } from "@/lib/types";

const icons: Record<string, string> = {
  kek: "🍰",
  desserts: "🧁",
  roti: "🥐",
  craft: "🎀"
};

export function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Link href={`/products/${category.slug}`} className="category-card" key={category.id}>
          <div className="category-icon">{icons[category.slug] ?? "✨"}</div>
          <h3>{category.name}</h3>
          <p className="muted">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
