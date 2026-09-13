"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

const money = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

export default function CustomerWishlist({ items = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Wishlist</h3>
        <span className="text-xs text-slate-500">{items.length} item{items.length === 1 ? "" : "s"}</span>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-400">Nothing saved yet</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {items.map((item) => {
            const p = item.product;
            return (
              <li key={item.id} className="flex gap-3 border border-slate-200 rounded-lg p-3">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-14 h-14 rounded object-cover bg-slate-100 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon name="inventory_2" size={18} className="text-slate-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${p.id}`} className="text-sm font-medium text-slate-900 hover:text-blue-600 line-clamp-2">
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{p.sku || "No SKU"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-slate-900">{money(p.retailPrice)}</span>
                    {!p.isActive && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Inactive</span>
                    )}
                    {p.isActive && p.stock <= 0 && (
                      <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Out of stock</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Saved {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
