"use client";

import { FormEvent, useEffect, useState } from "react";
import { getCategories, saveCategories, slugify } from "@/lib/local-store";
import type { Category } from "@/lib/types";

export function CategoriesAdminClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const category: Category = {
      id: `cat-${slugify(name)}`,
      name,
      slug: slugify(name),
      description
    };
    const nextCategories = [category, ...categories.filter((item) => item.slug !== category.slug)];
    saveCategories(nextCategories);
    setCategories(nextCategories);
    setName("");
    setDescription("");
  }

  function handleDelete(categorySlug: string) {
    const confirmed = confirm("Delete this category? Products under this category will not be deleted, but may appear uncategorized.");
    if (!confirmed) return;
    const nextCategories = categories.filter((category) => category.slug !== categorySlug);
    saveCategories(nextCategories);
    setCategories(nextCategories);
  }

  return (
    <div className="admin-dashboard-grid">
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add category</h3>
        <div className="form-grid">
          <label>
            Category name
            <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Example: Seasonal" />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} required placeholder="Short category description" />
          </label>
          <button className="btn btn-primary" type="submit">Save category</button>
        </div>
      </form>

      <div className="table-card">
        <h3>Current categories</h3>
        <div className="form-grid">
          {categories.map((category) => (
            <div className="stat-card" key={category.id}>
              <strong style={{ fontSize: "1.3rem" }}>{category.name}</strong>
              <p className="muted">/{category.slug}</p>
              <p>{category.description}</p>
              <button className="btn btn-danger btn-small" type="button" onClick={() => handleDelete(category.slug)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
