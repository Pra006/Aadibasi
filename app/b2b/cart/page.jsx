"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import BulkQuantityInput from "@/components/b2b/BulkQuantityInput";
import { formatNPR } from "@/lib/utils";

export default function B2BCartPage() {
  const [items, setItems] = useState([]);
  // Cart is client-side only for now; items would be added from the products page
  // via localStorage or a context provider in a full implementation

  function updateQuantity(idx, qty) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)));
  }

  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl text-forest-deep">Cart</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{items.length} items</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="shopping_cart" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">Your B2B cart is empty</p>
          <a
            href="/b2b/products"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-herbal-jade text-ivory-canvas text-sm font-semibold rounded-lg hover:brightness-95 transition-all"
          >
            <Icon name="storefront" size={16} />
            Browse Products
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="inventory_2" size={24} className="text-outline-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-forest-deep">{item.name}</div>
                  <div className="text-sm text-on-surface-variant mt-0.5">
                    {formatNPR(item.unitPrice)} / unit
                  </div>
                  <div className="mt-2 max-w-[160px]">
                    <BulkQuantityInput
                      value={item.quantity}
                      onChange={(q) => updateQuantity(idx, q)}
                      moq={item.moq || 1}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-forest-deep">
                    {formatNPR(item.unitPrice * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="mt-2 text-terracotta text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 h-fit">
            <h2 className="font-semibold text-forest-deep mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-semibold">{formatNPR(subtotal)}</span>
            </div>
            <div className="border-t border-outline-variant/40 pt-3 mt-3 flex justify-between">
              <span className="font-semibold text-forest-deep">Total</span>
              <span className="font-headline text-xl text-forest-deep">{formatNPR(subtotal)}</span>
            </div>
            <button
              disabled={items.length === 0}
              className="w-full mt-4 py-2.5 bg-herbal-jade text-ivory-canvas font-semibold rounded-lg hover:brightness-95 disabled:opacity-50 transition-all"
            >
              Create Purchase Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
