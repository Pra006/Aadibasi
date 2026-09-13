"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminDataTable from "@/components/admin/ui/AdminDataTable";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import Icon from "@/components/ui/Icon";

const ROLE_LABELS = {
  ADMIN: "Admin",
  ORDER_MANAGER: "Order Manager",
  PRODUCT_MANAGER: "Product Manager",
  B2B_MANAGER: "B2B Manager",
  FINANCE_MANAGER: "Finance Manager",
  SUPPORT_MANAGER: "Support Manager",
};

const columns = [
  {
    key: "name",
    label: "Name",
    render: (row) => `${row.user?.firstName || ""} ${row.user?.lastName || ""}`.trim() || "—",
  },
  {
    key: "email",
    label: "Email",
    render: (row) => row.user?.email || "—",
  },
  {
    key: "role",
    label: "Role",
    render: (row) => <AdminStatusBadge status={row.role}>{ROLE_LABELS[row.role] || row.role}</AdminStatusBadge>,
  },
  {
    key: "isActive",
    label: "Status",
    render: (row) => <AdminStatusBadge status={row.isActive ? "active" : "inactive"}>{row.isActive ? "Active" : "Inactive"}</AdminStatusBadge>,
  },
  {
    key: "lastLoginAt",
    label: "Last Login",
    render: (row) => row.user?.lastLoginAt ? new Date(row.user.lastLoginAt).toLocaleString() : "Never",
  },
  {
    key: "createdAt",
    label: "Created",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

export default function AdminsPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchAdmins = useCallback(async (page = 1, searchVal = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (searchVal) params.set("search", searchVal);
      const res = await fetch(`/api/admin/admins?${params}`);
      const json = await res.json();
      setData(json.data || []);
      setPagination({ page: json.page || 1, totalPages: json.totalPages || 1, total: json.total || 0 });
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchAdmins(1, search);
  }, [search]);

  return (
    <>
      <AdminPageHeader title="Admin Users" description="Manage administrator accounts and roles">
        <button onClick={() => router.push("/admin/admins/new")} className="btn btn-primary">
          <Icon name="plus" size={16} className="mr-1" /> Add Admin
        </button>
      </AdminPageHeader>
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={(p) => fetchAdmins(p, search)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        emptyIcon="users"
        emptyMessage="No admin users found"
        actions={(row) => (
          <button onClick={() => router.push(`/admin/admins/${row.id}`)} className="btn btn-sm btn-ghost">
            <Icon name="edit" size={14} />
          </button>
        )}
      />
    </>
  );
}
