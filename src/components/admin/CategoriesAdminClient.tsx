"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  getCategories,
  getProducts,
  saveCategories,
  saveProducts,
  slugify
} from "@/lib/local-store";
import type { Category } from "@/lib/types";

export function CategoriesAdminClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameMs, setNameMs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionMs, setDescriptionMs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  function persistCategories(nextCategories: Category[]) {
    const orderedCategories = nextCategories.map((category, index) => ({ ...category, sortOrder: index }));
    saveCategories(orderedCategories);
    setCategories(orderedCategories);
  }

  function resetForm() {
    setNameMs("");
    setNameEn("");
    setDescriptionMs("");
    setDescriptionEn("");
    setEditingCategory(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slugSource = nameEn || nameMs;
    const nextSlug = slugify(slugSource);

    const category: Category = {
      id: editingCategory?.id ?? `cat-${nextSlug}`,
      name: nameMs || nameEn,
      slug: nextSlug,
      description: descriptionMs || descriptionEn,
      nameMs,
      nameEn,
      descriptionMs,
      descriptionEn,
      sortOrder: editingCategory?.sortOrder ?? categories.length
    };

    if (editingCategory) {
      const oldSlug = editingCategory.slug;
      const updatedCategories = categories.map((item) =>
        item.id === editingCategory.id ? category : item
      );
      persistCategories(updatedCategories);

      if (oldSlug !== nextSlug) {
        const updatedProducts = getProducts().map((product) =>
          product.categorySlug === oldSlug
            ? { ...product, categorySlug: nextSlug }
            : product
        );
        saveProducts(updatedProducts);
      }
    } else {
      const withoutDuplicate = categories.filter((item) => item.slug !== category.slug);
      persistCategories([...withoutDuplicate, category]);
    }

    resetForm();
  }

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setNameMs(category.nameMs || category.name);
    setNameEn(category.nameEn || category.name);
    setDescriptionMs(category.descriptionMs || category.description);
    setDescriptionEn(category.descriptionEn || category.description);

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleDelete(categorySlug: string) {
    const confirmed = confirm("Delete this category? Products under this category will not be deleted, but may appear uncategorized.");
    if (!confirmed) return;
    persistCategories(categories.filter((category) => category.slug !== categorySlug));

    if (editingCategory?.slug === categorySlug) {
      resetForm();
    }
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
      <form className="form-card" onSubmit={handleSubmit} ref={formRef}>
        <h3>{editingCategory ? "Edit category" : "Add category"}</h3>
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
        <div className="category-form-actions">
          <button className="btn btn-primary" type="submit">
            {editingCategory ? "Update category" : "Save category"}
          </button>
          {editingCategory ? (
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
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
                <button className="btn btn-secondary btn-small" type="button" onClick={() => handleEdit(category)}>
                  Edit
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
