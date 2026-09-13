"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";

const input =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 outline-none";

function Field({ label, hint, children, required, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export const emptyProduct = {
  name: "",
  slug: "",
  sku: "",
  brand: "",
  description: "",
  retailPrice: "",
  compareAt: "",
  stock: 0,
  moq: 1,
  categoryId: "",
  images: [],
  isActive: true,
  isB2B: false,
};

/**
 * Create/edit form for a Product. `onSubmit` receives the payload and should
 * throw an Error with a readable message to surface a failure.
 */
export default function ProductForm({ initial, onSubmit, submitLabel, busyLabel, hasVariants = false }) {
  const [form, setForm] = useState({ ...emptyProduct, ...initial });
  const [categories, setCategories] = useState([]);
  const [imageDraft, setImageDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCategories(Array.isArray(d) ? d : d.data || []))
      .catch(() => setCategories([]));
  }, []);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  function handleName(name) {
    setForm((p) => ({
      ...p,
      name,
      slug: slugEdited
        ? p.slug
        : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  }

  function addImage() {
    const url = imageDraft.trim();
    if (!url) return;
    if (!/^(https?:\/\/|\/)/.test(url)) {
      setError("Image must be a URL or an absolute path");
      return;
    }
    if (form.images.includes(url)) {
      setError("That image is already attached");
      return;
    }
    setError("");
    update("images", [...form.images, url]);
    setImageDraft("");
  }

  function moveImage(index, delta) {
    const next = [...form.images];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update("images", next);
  }

  const discount = useMemo(() => {
    const price = Number(form.retailPrice);
    const compareAt = Number(form.compareAt);
    if (!price || !compareAt || compareAt <= price) return 0;
    return Math.round(((compareAt - price) / compareAt) * 100);
  }, [form.retailPrice, form.compareAt]);

  // Client-side mirror of lib/products.js so mistakes surface before a round trip.
  function clientErrors() {
    const errs = [];
    if (!form.name.trim()) errs.push("Product name is required");
    if (!form.slug.trim()) errs.push("URL slug is required");
    const price = Number(form.retailPrice);
    if (!form.retailPrice || Number.isNaN(price) || price <= 0) errs.push("Retail price must be greater than 0");
    if (form.compareAt !== "" && form.compareAt != null) {
      const compareAt = Number(form.compareAt);
      if (Number.isNaN(compareAt) || compareAt <= 0) errs.push("Compare-at price must be a positive number");
      else if (compareAt <= price) errs.push("Compare-at price must be higher than the retail price");
    }
    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) errs.push("Stock must be a whole number of 0 or more");
    if (Number(form.moq) < 1 || !Number.isInteger(Number(form.moq))) errs.push("Minimum order quantity must be at least 1");
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = clientErrors();
    if (errs.length) {
      setError(errs.join(". "));
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        name: form.name.trim(),
        slug: form.slug.trim(),
        sku: form.sku.trim() || null,
        brand: form.brand.trim() || null,
        description: form.description.trim() || null,
        retailPrice: Number(form.retailPrice),
        compareAt: form.compareAt === "" || form.compareAt == null ? null : Number(form.compareAt),
        stock: Number(form.stock),
        moq: Number(form.moq),
        categoryId: form.categoryId || null,
        images: form.images,
        isActive: form.isActive,
        isB2B: form.isB2B,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <Icon name="error" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Basics */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Product details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" required>
            <input className={input} value={form.name} onChange={(e) => handleName(e.target.value)} maxLength={200} />
          </Field>
          <Field label="URL slug" required hint="Used in the storefront address">
            <input
              className={input}
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                update("slug", e.target.value);
              }}
            />
          </Field>
          <Field label="SKU" hint="Must be unique across the catalog">
            <input className={input} value={form.sku ?? ""} onChange={(e) => update("sku", e.target.value)} />
          </Field>
          <Field label="Brand">
            <input className={input} value={form.brand ?? ""} onChange={(e) => update("brand", e.target.value)} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              className={`${input} resize-y`}
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
            />
          </Field>
          <Field label="Category">
            <select className={input} value={form.categoryId ?? ""} onChange={(e) => update("categoryId", e.target.value)}>
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Pricing & stock */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Pricing &amp; inventory</h2>
        {hasVariants && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            This product sells through options, so customers pay the price of the option they choose and stock is the sum of all options. The price below is used only as a fallback.
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Retail price (NPR)" required>
            <input
              type="number" min="0" step="0.01" className={input}
              value={form.retailPrice}
              onChange={(e) => update("retailPrice", e.target.value)}
            />
          </Field>
          <Field label="Compare-at price" hint={discount > 0 ? `${discount}% discount shown` : "Original price, for discounts"}>
            <input
              type="number" min="0" step="0.01" className={input}
              value={form.compareAt ?? ""}
              onChange={(e) => update("compareAt", e.target.value)}
            />
          </Field>
          <Field label="Stock" hint={hasVariants ? "Managed by options below" : undefined}>
            <input type="number" min="0" step="1" className={input} value={form.stock} disabled={hasVariants} onChange={(e) => update("stock", e.target.value)} />
          </Field>
          <Field label="Min. order qty">
            <input type="number" min="1" step="1" className={input} value={form.moq} onChange={(e) => update("moq", e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} />
            Active — visible in the store
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={form.isB2B} onChange={(e) => update("isB2B", e.target.checked)} />
            Available to B2B buyers
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Images</h2>
        <div className="flex gap-2">
          <input
            className={input}
            placeholder="https://… or /uploads/photo.jpg"
            value={imageDraft}
            onChange={(e) => setImageDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <button
            type="button"
            onClick={addImage}
            className="shrink-0 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            Add
          </button>
        </div>

        {form.images.length === 0 ? (
          <p className="text-sm text-slate-400">No images yet. The first image is used as the product thumbnail.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((url, i) => (
              <li key={url} className="border border-slate-200 rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-28 object-cover bg-slate-100" />
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[11px] text-slate-400">{i === 0 ? "Thumbnail" : `#${i + 1}`}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-30" aria-label="Move left">
                      <Icon name="chevron_left" size={16} />
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-30" aria-label="Move right">
                      <Icon name="chevron_right" size={16} />
                    </button>
                    <button type="button" onClick={() => update("images", form.images.filter((u) => u !== url))}
                      className="p-1 rounded hover:bg-red-50 text-red-500" aria-label="Remove image">
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
