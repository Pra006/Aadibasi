"use client";

import Icon from "@/components/ui/Icon";
import { formatNPR } from "@/lib/utils";

export default function B2BProductCard({ product, onAddToCart, onRequestQuote }) {
  const tiers = product.b2bPriceTiers || [];
  const effectivePrice = product.effectivePrice ?? product.retailPrice;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-surface-container-low overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant">
            <Icon name="image" size={40} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-forest-deep line-clamp-2 mb-1">
          {product.name}
        </h3>

        <div className="text-xs text-on-surface-variant mb-2 uppercase tracking-wider">
          {product.category}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-headline text-lg text-forest-deep">
            {formatNPR(effectivePrice)}
          </span>
          {effectivePrice < product.retailPrice && (
            <span className="text-xs text-on-surface-variant line-through">
              {formatNPR(product.retailPrice)}
            </span>
          )}
        </div>

        {/* MOQ */}
        <div className="text-xs text-on-surface-variant mb-3">
          MOQ: <span className="font-semibold text-forest-deep">{product.moq} units</span>
        </div>

        {/* Price tiers (compact) */}
        {tiers.length > 0 && (
          <div className="mb-3 space-y-1">
            {tiers.slice(0, 3).map((tier) => (
              <div
                key={tier.id}
                className="flex justify-between text-xs text-on-surface-variant"
              >
                <span>
                  {tier.minQty}–{tier.maxQty ?? "∞"}
                </span>
                <span className="font-semibold text-forest-deep">
                  {formatNPR(tier.unitPrice)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-forest-base text-ivory-canvas text-xs font-semibold rounded hover:bg-forest-deep transition-colors"
            >
              <Icon name="add_shopping_cart" size={14} />
              Add
            </button>
          )}
          {onRequestQuote && (
            <button
              onClick={() => onRequestQuote(product)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-forest-base/30 text-forest-deep text-xs font-semibold rounded hover:bg-forest-base/5 transition-colors"
            >
              <Icon name="request_quote" size={14} />
              RFQ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
