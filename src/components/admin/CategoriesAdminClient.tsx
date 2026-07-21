"use client";

import { FormEvent, useEffect, useState } from "react";
import { getCategories, saveCategories, slugify } from "@/lib/local-store";
import type { Category } from "@/lib/types";

export function CategoriesAdminClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameMs, setNameMs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionMs, setDescriptionMs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  function persistCategories(nextCategories: Category[]) {
    const orderedCategories = nextCategories.map((category, index) => ({ ...category, sortOrder: index }));
    saveCategories(orderedCategories);
    setCategories(orderedCategories);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slugSource = nameEn || nameMs;
    const category: Category = {
      id: `cat-${slugify(slugSource)}`,
      name: nameMs || nameEn,
      slug: slugify(slugSource),
      description: descriptionMs || descriptionEn,
      nameMs,
      nameEn,
      descriptionMs,
      descriptionEn,
      sortOrder: categories.length
    };
    const withoutDuplicate = categories.filter((item) => item.slug !== category.slug);
    persistCategories([...withoutDuplicate, category]);
    setNameMs("");
    setNameEn("");
    setDescriptionMs("");
    setDescriptionEn("");
  }

  function handleDelete(categorySlug: string) {
    const confirmed = confirm("Delete this category? Products under this category will not be deleted, but may appear uncategorized.");
    if (!confirmed) return;
    persistCategories(categories.filter((category) => category.slug !== categorySlug));
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const nextCategories = [...categories];
    [nextCategories[index], nextCategories[targetIndex]] = [nextCategories[targetIndex], nextCategories[index]];
    persistCategories(nextCategories);
  }

  return (
    <div className="admin-dashboard-grid">
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add category</h3>
        <p className="prototype-note">
          Enter both languages. Customers will see the matching category name and description when they choose BM or EN.
        </p>
        <div className="form-grid two">
          <label>
            Category name (Bahasa Melayu)
            <input value={nameMs} onChange={(event) => setNameMs(event.target.value)} required placeholder="Contoh: Bermusim" />
          </label>
          <label>
            Category name (English)
            <input value={nameEn} onChange={(event) => setNameEn(event.target.value)} required placeholder="Example: Seasonal" />
          </label>
          <label>
            Description (Bahasa Melayu)
            <textarea value={descriptionMs} onChange={(event) => setDescriptionMs(event.target.value)} required placeholder="Penerangan kategori ringkas" />
          </label>
          <label>
            Description (English)
            <textarea value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} required placeholder="Short category description" />
          </label>
        </div>
        <button className="btn btn-primary" type="submit">Save category</button>
      </form>

      <div className="table-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <h3>Current categories</h3>
            <p className="muted">Use the arrow buttons to rearrange the order shown on the customer website.</p>
          </div>
        </div>
        <div className="form-grid">
          {categories.map((category, index) => (
            <div className="stat-card category-order-card" key={category.id}>
              <div className="category-order-number" aria-label={`Position ${index + 1}`}>{index + 1}</div>
              <div className="category-order-content">
                <strong style={{ fontSize: "1.3rem" }}>{category.nameMs || category.name}</strong>
                <p className="muted" style={{ marginBottom: 6 }}>{category.nameEn || category.name} · /{category.slug}</p>
                <p><strong>BM:</strong> {category.descriptionMs || category.description}</p>
                <p><strong>EN:</strong> {category.descriptionEn || category.description}</p>
              </div>
              <div className="category-order-actions">
                <button
                  className="btn btn-secondary btn-small"
                  type="button"
                  onClick={() => moveCategory(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${category.name} up`}
                >
                  ↑ Up
                </button>
                <button
                  className="btn btn-secondary btn-small"
                  type="button"
                  onClick={() => moveCategory(index, 1)}
                  disabled={index === categories.length - 1}
                  aria-label={`Move ${category.name} down`}
                >
                  ↓ Down
                </button>
                <button className="btn btn-danger btn-small" type="button" onClick={() => handleDelete(category.slug)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
