"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getProductById, slugify, upsertProduct } from "@/lib/local-store";
import type { Category, Product, ProductOption } from "@/lib/types";

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
        notes: notesPart || undefined
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
  const [categorySlug, setCategorySlug] = useState("kek");
  const [descriptionMs, setDescriptionMs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [optionsText, setOptionsText] = useState("7 inch | 55");

  const isEditing = Boolean(productId);

  useEffect(() => {
    setCategories(getCategories());
    if (!productId) return;
    const product = getProductById(productId);
    if (!product) return;
    setNameMs(product.nameMs || product.name);
    setNameEn(product.nameEn || product.name);
    setCategorySlug(product.categorySlug);
    setDescriptionMs(product.descriptionMs || product.description);
    setDescriptionEn(product.descriptionEn || product.description);
    setImageUrl(product.imageUrl ?? "");
    setIsAvailable(product.isAvailable);
    setIsFeatured(product.isFeatured);
    setOptionsText(optionsToText(product.options));
  }, [productId]);

  const previewOptions = useMemo(() => parseOptions(optionsText), [optionsText]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const product: Product = {
      id: productId || slugify(nameEn || nameMs),
      categorySlug,
      name: nameMs || nameEn,
      nameMs,
      nameEn,
      description: descriptionMs || descriptionEn,
      descriptionMs,
      descriptionEn,
      imageUrl: imageUrl || undefined,
      isAvailable,
      isFeatured,
      options: previewOptions.length ? previewOptions : [{ id: "option-1", label: "Price", price: 0 }]
    };
    upsertProduct(product);
    router.push("/admin/products");
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <p className="prototype-note">
        Enter the product name and description in both languages. Customers will automatically see BM or EN based on their language selection.
      </p>

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
          <select value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
            {categories.map((category) => (
              <option value={category.slug} key={category.id}>
                {category.nameMs || category.name} / {category.nameEn || category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Image URL, optional for now
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Later this will use Supabase Storage upload" />
        </label>
      </div>

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
          Write one option per line using this format: <strong>Label | Price | Notes</strong>. Example: <strong>25 pcs | 36</strong>. Size and quantity labels can be shared for both languages.
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
          <button className="btn btn-primary" type="submit">{isEditing ? "Save product" : "Add product"}</button>
          <button className="btn btn-secondary" type="button" onClick={() => router.push("/admin/products")}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
