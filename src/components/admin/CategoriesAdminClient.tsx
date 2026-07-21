"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { deleteCategory, fetchCategories, saveCategory, updateCategoryOrder } from "@/lib/data";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoriesAdminClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameMs, setNameMs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionMs, setDescriptionMs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function reload() {
    setCategories(await fetchCategories());
  }

  useEffect(() => {
    void reload().catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load categories."));
  }, []);

  function resetForm() {
    setNameMs("");
    setNameEn("");
    setDescriptionMs("");
    setDescriptionEn("");
    setEditingCategory(null);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const slug = slugify(nameEn || nameMs);
      if (!slug) throw new Error("Please enter a valid category name.");
      await saveCategory({
        id: editingCategory?.id,
        slug,
        nameMs,
        nameEn,
        descriptionMs,
        descriptionEn,
        sortOrder: editingCategory?.sortOrder ?? categories.length
      });
      await reload();
      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save category.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setNameMs(category.nameMs);
    setNameEn(category.nameEn);
    setDescriptionMs(category.descriptionMs);
    setDescriptionEn(category.descriptionEn);
    setError("");
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function handleDelete(category: Category) {
    const confirmed = confirm("Delete this category? A category that still contains products cannot be deleted.");
    if (!confirmed) return;
    setError("");
    try {
      await deleteCategory(category.id);
      if (editingCategory?.id === category.id) resetForm();
      await reload();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete category.");
    }
  }

  async function moveCategory(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const nextCategories = [...categories];
    [nextCategories[index], nextCategories[targetIndex]] = [nextCategories[targetIndex], nextCategories[index]];
    setCategories(nextCategories.map((category, categoryIndex) => ({ ...category, sortOrder: categoryIndex })));
    setError("");
    try {
      await updateCategoryOrder(nextCategories);
      await reload();
    } catch (moveError) {
      setError(moveError instanceof Error ? moveError.message : "Unable to rearrange categories.");
      await reload();
    }
  }

  return (
    <div className="admin-dashboard-grid">
      <form className="form-card" onSubmit={handleSubmit} ref={formRef}>
        <h3>{editingCategory ? "Edit category" : "Add category"}</h3>
        <p className="prototype-note">
          Enter both languages. Customers will see the matching category name and description when they choose BM or EN.
        </p>
        {error ? <p className="prototype-note" role="alert">{error}</p> : null}
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
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingCategory ? "Update category" : "Save category"}
          </button>
          {editingCategory ? <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancel edit</button> : null}
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
                <strong style={{ fontSize: "1.3rem" }}>{category.nameMs}</strong>
                <p className="muted" style={{ marginBottom: 6 }}>{category.nameEn} · /{category.slug}</p>
                <p><strong>BM:</strong> {category.descriptionMs}</p>
                <p><strong>EN:</strong> {category.descriptionEn}</p>
              </div>
              <div className="category-order-actions">
                <button className="btn btn-secondary btn-small" type="button" onClick={() => moveCategory(index, -1)} disabled={index === 0}>↑ Up</button>
                <button className="btn btn-secondary btn-small" type="button" onClick={() => moveCategory(index, 1)} disabled={index === categories.length - 1}>↓ Down</button>
                <button className="btn btn-secondary btn-small" type="button" onClick={() => handleEdit(category)}>Edit</button>
                <button className="btn btn-danger btn-small" type="button" onClick={() => handleDelete(category)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
