"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminDataTable from "@/components/admin/ui/AdminDataTable";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import Icon from "@/components/ui/Icon";

const control = "px-2.5 py-2 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-300";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [notice, setNotice] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const [sortField, sortOrder] = sort.split(":");
      const params = new URLSearchParams({ page, limit: 20, sort: sortField, order: sortOrder });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("categoryId", categoryFilter);
      if (stockFilter) params.set("stock", stockFilter);

      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load products");
      setProducts(json.data);
      setPagination(json.pagination);
    } catch (err) {
      setProducts([]);
      setNotice({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter, stockFilter, sort]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCategories(Array.isArray(d) ? d : d.data || []))
      .catch(() => setCategories([]));
  }, []);

  async function handleDelete(row) {
    const confirmed = window.confirm(
      `Delete “${row.name}”?\n\nIf it appears in any order it will be deactivated and hidden from the store instead of removed.`
    );
    if (!confirmed) return;

    setDeleting(row.id);
    try {
      const res = await fetch(`/api/admin/products/${row.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      setNotice({ type: "success", text: json.message });
      fetchProducts(pagination.page);
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (row) => (
        <Link href={`/admin/products/${row.id}`} className="flex items-center gap-3 group">
          {row.images?.[0] ? (
            <img src={row.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Icon name="inventory_2" size={18} className="text-slate-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{row.name}</p>
            <p className="text-xs text-slate-500">{row.brand || row.slug}</p>
          </div>
        </Link>
      ),
    },
    { key: "sku", label: "SKU", render: (row) => row.sku || "—" },
    {
      key: "options",
      label: "Options",
      render: (row) =>
        row._count?.variants > 0 ? (
          <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{row._count.variants}</span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    { key: "category", label: "Category", render: (row) => row.category?.name || "—" },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div>
          <span className="font-medium">Rs {Number(row.retailPrice).toLocaleString()}</span>
          {row.compareAt > row.retailPrice && (
            <span className="ml-1.5 text-xs text-slate-400 line-through">Rs {Number(row.compareAt).toLocaleString()}</span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) => (
        <span className={row.stock <= 0 ? "text-red-600 font-medium" : row.stock <= 10 ? "text-amber-600 font-medium" : ""}>
          {row.stock}
        </span>
      ),
    },
    { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.isActive ? "ACTIVE" : "INACTIVE"} /> },
    { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-1">
      <Link href={`/admin/products/${row.id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" aria-label="Edit product">
        <Icon name="edit" size={16} />
      </Link>
      <button
        onClick={() => handleDelete(row)}
        disabled={deleting === row.id}
        className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-40"
        aria-label="Delete product"
      >
        <Icon name="delete" size={16} />
      </button>
    </div>
  );

  return (
    <div>
      <AdminPageHeader title="Products" description="Manage your product catalog">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          <Icon name="add" size={16} /> Add Product
        </Link>
      </AdminPageHeader>

      {notice && (
        <div
          className={`mb-4 flex items-start justify-between gap-3 px-4 py-3 rounded-lg border text-sm ${
            notice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Icon name={notice.type === "success" ? "check_circle" : "error"} size={18} />
            {notice.text}
          </span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <AdminDataTable
        columns={columns}
        data={products}
        loading={loading}
        pagination={pagination}
        onPageChange={(p) => fetchProducts(p)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, SKU or brand…"
        emptyIcon="inventory_2"
        emptyMessage="No products found"
        actions={actions}
        headerExtra={
          <>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={control}>
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="b2b">B2B</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={control}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className={control}>
              <option value="">Any stock</option>
              <option value="low">Low stock (≤10)</option>
              <option value="out">Out of stock</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={control}>
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="name:asc">Name A–Z</option>
              <option value="name:desc">Name Z–A</option>
              <option value="retailPrice:asc">Price low–high</option>
              <option value="retailPrice:desc">Price high–low</option>
              <option value="stock:asc">Stock low–high</option>
              <option value="stock:desc">Stock high–low</option>
            </select>
          </>
        }
      />
    </div>
  );
}
