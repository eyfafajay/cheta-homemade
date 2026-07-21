"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCategories, fetchProductById, saveProduct } from "@/lib/data";
import { slugify } from "@/lib/utils";
import type { Category, ProductOption } from "@/lib/types";

function parseOptions(value: string): ProductOption[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [labelPart, pricePart, notesPart] = line.split("|").map((part) => part.trim());
      const price = Number(pricePart?.replace(/[^0-9.]/g, "")) || 0;
      return {
        id: `${slugify(labelPart || "option")}-${index + 1}`,
        label: labelPart || "Option",
        price,
        notes: notesPart || undefined,
        sortOrder: index
      };
    });
}

function optionsToText(options: ProductOption[]) {
  return options.map((option) => `${option.label} | ${option.price}${option.notes ? ` | ${option.notes}` : ""}`).join("\n");
}

export function ProductFormClient({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameMs, setNameMs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [descriptionMs, setDescriptionMs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [imagePath, setImagePath] = useState<string | undefined>();
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [optionsText, setOptionsText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(productId);

  useEffect(() => {
    void Promise.all([fetchCategories(), productId ? fetchProductById(productId) : Promise.resolve(undefined)])
      .then(([nextCategories, product]) => {
        setCategories(nextCategories);
        if (!product) {
          setCategorySlug(nextCategories[0]?.slug ?? "");
          return;
        }
        setNameMs(product.nameMs);
        setNameEn(product.nameEn);
        setCategorySlug(product.categorySlug);
        setDescriptionMs(product.descriptionMs);
        setDescriptionEn(product.descriptionEn);
        setImagePath(product.imagePath);
        setCurrentImageUrl(product.imageUrl);
        setIsAvailable(product.isAvailable);
        setIsFeatured(product.isFeatured);
        setOptionsText(optionsToText(product.options));
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load product form."));
  }, [productId]);

  const previewOptions = useMemo(() => parseOptions(optionsText), [optionsText]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (!categorySlug) throw new Error("Please add a category before saving a product.");
      await saveProduct(
        {
          id: productId,
          categorySlug,
          nameMs,
          nameEn,
          descriptionMs,
          descriptionEn,
          imagePath,
          isAvailable,
          isFeatured,
          options: previewOptions
        },
        imageFile
      );
      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <p className="prototype-note">
        Enter the product name and description in both languages. Customers will automatically see BM or EN based on their language selection.
      </p>
      {error ? <p className="prototype-note" role="alert">{error}</p> : null}

      <div className="form-grid two">
        <label>
          Product name (Bahasa Melayu)
          <input value={nameMs} onChange={(event) => setNameMs(event.target.value)} required placeholder="Contoh: Kek Lobak Merah" />
        </label>
        <label>
          Product name (English)
          <input value={nameEn} onChange={(event) => setNameEn(event.target.value)} required placeholder="Example: Carrot Cake" />
        </label>
        <label>
          Description (Bahasa Melayu)
          <textarea value={descriptionMs} onChange={(event) => setDescriptionMs(event.target.value)} required placeholder="Penerangan produk ringkas" />
        </label>
        <label>
          Description (English)
          <textarea value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} required placeholder="Short product description" />
        </label>
        <label>
          Category
          <select value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)} required>
            <option value="" disabled>Select category</option>
            {categories.map((category) => (
              <option value={category.slug} key={category.id}>{category.nameMs} / {category.nameEn}</option>
            ))}
          </select>
        </label>
        <label>
          Product image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {currentImageUrl && !imageFile ? (
        <div style={{ marginTop: 14 }}>
          <p className="muted">Current image</p>
          <img src={currentImageUrl} alt={nameMs || nameEn || "Product"} style={{ width: 180, borderRadius: 18 }} />
        </div>
      ) : null}
      {imageFile ? <p className="prototype-note" style={{ marginTop: 14 }}>Selected image: {imageFile.name}</p> : null}

      <div className="form-grid" style={{ marginTop: 14 }}>
        <label>
          Price options
          <textarea
            value={optionsText}
            onChange={(event) => setOptionsText(event.target.value)}
            placeholder="7 inch | 55\n10 inch | 110 | Optional notes"
          />
        </label>
        <p className="prototype-note">
          Write one option per line using this format: <strong>Label | Price | Notes</strong>. Size and quantity labels can be shared for both languages.
        </p>
        <label>
          <span>
            <input checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} type="checkbox" style={{ width: "auto", marginRight: 8 }} />
            Available
          </span>
        </label>
        <label>
          <span>
            <input checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} type="checkbox" style={{ width: "auto", marginRight: 8 }} />
            Featured on homepage
          </span>
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : isEditing ? "Save product" : "Add product"}</button>
          <button className="btn btn-secondary" type="button" onClick={() => router.push("/admin/products")}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
