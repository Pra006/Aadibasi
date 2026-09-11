"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import B2BProductCard from "@/components/b2b/B2BProductCard";

export default function B2BProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  async function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    const res = await fetch(`/api/b2b/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setPagination(data.pagination || null);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, [page, category]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-headline text-3xl text-forest-deep">B2B Products</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Browse products with B2B pricing
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-base/20"
          />
        </form>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-base/20"
        >
          <option value="">All Categories</option>
          <option value="ayurvedic-oils">Ayurvedic Oils</option>
          <option value="herbal-teas">Herbal Teas</option>
          <option value="incense-resins">Incense & Resins</option>
          <option value="skincare">Skincare</option>
          <option value="hair-care">Hair Care</option>
          <option value="supplements">Supplements</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="hourglass_empty" size={24} className="animate-spin text-on-surface-variant" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="inventory_2" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">No B2B products found</p>
          {search && (
            <button
              onClick={() => { setSearch(""); fetchProducts(); }}
              className="mt-3 text-sm font-semibold text-forest-deep hover:text-antique-gold"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <B2BProductCard key={p.id} product={p} onAddToCart={() => {}} onRequestQuote={() => {}} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-outline-variant/60 rounded-lg disabled:opacity-40 hover:bg-surface-container-low"
              >
                Previous
              </button>
              <span className="text-sm text-on-surface-variant">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-2 text-sm border border-outline-variant/60 rounded-lg disabled:opacity-40 hover:bg-surface-container-low"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
