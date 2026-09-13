"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminDataTable from "@/components/admin/ui/AdminDataTable";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        const all = data.data || data || [];
        const parentMap = {};
        const roots = [];
        for (const c of all) {
          if (!c.parentId) roots.push(c);
          else {
            if (!parentMap[c.parentId]) parentMap[c.parentId] = [];
            parentMap[c.parentId].push(c);
          }
        }
        const flat = [];
        for (const root of roots) {
          flat.push({ ...root, depth: 0 });
          for (const child of parentMap[root.id] || []) {
            flat.push({ ...child, depth: 1 });
          }
        }
        setCategories(flat);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const columns = [
    {
      header: "Name",
      accessor: (row) => (
        <Link href={`/admin/categories/${row.id}`} style={{ fontWeight: 500, color: "inherit", textDecoration: "none", paddingLeft: (row.depth || 0) * 24 }}>
          {row.depth ? "└ " : ""}{row.name}
        </Link>
      ),
    },
    { header: "Slug", accessor: (row) => row.slug },
    { header: "Products", accessor: (row) => row._count?.products ?? 0 },
    {
      header: "Status",
      accessor: (row) => <AdminStatusBadge status={row.isActive ? "active" : "inactive"} />,
    },
  ];

  const actions = (row) => (
    <Link href={`/admin/categories/${row.id}`}>
      <button style={{ padding: "4px 12px", fontSize: 13, border: "1px solid #ddd", borderRadius: 6, background: "white", cursor: "pointer" }}>
        Edit
      </button>
    </Link>
  );

  return (
    <div>
      <AdminPageHeader title="Categories" description="Organize products into categories">
        <Link href="/admin/categories/new">
          <button style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500 }}>
            Add Category
          </button>
        </Link>
      </AdminPageHeader>

      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        emptyIcon="folder"
        emptyMessage="No categories found"
        actions={actions}
      />
    </div>
  );
}
