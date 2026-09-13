"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import AdminStatCard from "@/components/admin/ui/AdminStatCard";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

const formatNPR = (v) => `NPR ${(v || 0).toLocaleString("en-IN")}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/dashboard?days=${days}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Dashboard" description="Platform overview" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <AdminPageHeader title="Dashboard" />
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Icon name="error_outline" size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { label: "Pending Applications", value: stats.b2b.pendingApplications, href: "/admin/b2b/applications", icon: "description", accent: "amber" },
    { label: "Pending RFQs", value: stats.b2bWorkflow.pendingRFQs, href: "/admin/b2b/rfqs", icon: "request_quote", accent: "blue" },
    { label: "Pending Customer Orders", value: stats.orders.pendingCustomerOrders, href: "/admin/customer-orders", icon: "receipt_long", accent: "purple" },
    { label: "Outstanding Invoices", value: stats.b2bWorkflow.outstandingInvoices, href: "/admin/b2b/invoices", icon: "receipt", accent: "red" },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Platform overview">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 outline-none"
        >
          <option value={1}>Today</option>
          <option value={7}>7 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>3 Months</option>
          <option value={180}>6 Months</option>
          <option value={365}>1 Year</option>
        </select>
      </AdminPageHeader>

      {/* Customer Stats */}
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Customers</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStatCard label="Total Customers" value={stats.customers.total} icon="people" accent="blue" />
        <AdminStatCard label="New Customers" value={stats.customers.new} icon="person_add" accent="green" />
        <AdminStatCard label="Customer Orders" value={stats.orders.customerOrders} icon="receipt_long" accent="purple" />
        <AdminStatCard label="Customer Revenue" value={formatNPR(stats.revenue.customer)} icon="account_balance_wallet" accent="amber" />
      </div>

      {/* B2B Stats */}
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">B2B Business</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStatCard label="B2B Organizations" value={stats.b2b.totalOrgs} icon="corporate_fare" accent="blue" />
        <AdminStatCard label="Active Organizations" value={stats.b2b.activeOrgs} icon="verified" accent="green" />
        <AdminStatCard label="B2B Orders" value={stats.orders.b2bOrders} icon="local_shipping" accent="purple" />
        <AdminStatCard label="B2B Revenue" value={formatNPR(stats.revenue.b2b)} icon="payments" accent="amber" />
      </div>

      {/* Revenue + B2B Workflow */}
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Revenue & Workflow</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStatCard label="Total Revenue" value={formatNPR(stats.revenue.total)} icon="trending_up" accent="green" />
        <AdminStatCard label="Active Quotations" value={stats.b2bWorkflow.activeQuotations} icon="calculate" accent="blue" />
        <AdminStatCard label="Pending POs" value={stats.b2bWorkflow.pendingPOs} icon="assignment" accent="amber" />
        <AdminStatCard label="Outstanding Invoices" value={stats.b2bWorkflow.outstandingInvoices} icon="receipt" accent="red" />
      </div>

      {/* Quick Action Links */}
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Requires Attention</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.filter((q) => q.value > 0).map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm hover:border-slate-300 transition group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${q.accent}-50 text-${q.accent}-600`}>
              <Icon name={q.icon} size={20} />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{q.value}</div>
              <div className="text-xs text-slate-500">{q.label}</div>
            </div>
            <Icon name="chevron_right" size={18} className="ml-auto text-slate-300 group-hover:text-slate-500" />
          </Link>
        ))}
        {quickLinks.filter((q) => q.value > 0).length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-8 text-center">
            <Icon name="check_circle" size={32} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">All caught up! No items require attention.</p>
          </div>
        )}
      </div>
    </div>
  );
}
