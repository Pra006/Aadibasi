"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { formatNPR } from "@/lib/utils";

export default function VariantAndCart({ product }) {
  const [variantId, setVariantId] = useState(product.variants?.[1]?.id || product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);
  const variant = product.variants?.find((v) => v.id === variantId);
  const outOfStock = !variant || variant.stock <= 0;

  return (
    <div className="mt-6">
      {product.variants?.length > 1 && (
        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Size</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`px-4 py-2 rounded border text-sm font-semibold ${
                  variantId === v.id
                    ? "border-forest-base bg-forest-base text-ivory-canvas"
                    : "border-outline-variant text-forest-deep hover:border-forest-base"
                }`}
              >
                {v.size} · {formatNPR(v.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="inline-flex items-center border border-outline-variant rounded overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 text-forest-deep hover:bg-forest-base/5"
            aria-label="Decrease"
          >
            <Icon name="remove" size={16} />
          </button>
          <span className="w-12 text-center font-semibold text-forest-deep">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(variant?.stock || 99, q + 1))}
            className="w-10 h-10 text-forest-deep hover:bg-forest-base/5"
            aria-label="Increase"
          >
            <Icon name="add" size={16} />
          </button>
        </div>
        <span className="text-xs text-on-surface-variant">
          {variant?.stock > 0 ? (
            <span className="text-herbal-jade font-semibold">In stock — {variant.stock} left</span>
          ) : (
            <span className="text-terracotta font-semibold">Out of stock</span>
          )}
        </span>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="flex-1" disabled={outOfStock}>
          <Icon name="add_shopping_cart" size={18} className="text-antique-gold" />
          Add to Cart
        </Button>
        <Button size="lg" variant="gold" className="flex-1" disabled={outOfStock}>
          Buy Now
        </Button>
        <button
          aria-label="Add to wishlist"
          className="w-12 h-12 rounded border border-outline-variant flex items-center justify-center text-forest-deep hover:text-terracotta hover:border-terracotta"
        >
          <Icon name="favorite" size={20} />
        </button>
      </div>
    </div>
  );
}
