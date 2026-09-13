"use client";

import { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminStatCard from "@/components/admin/ui/AdminStatCard";
import Icon from "@/components/ui/Icon";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/dashboard?days=${days}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Reports" description="Business overview and analytics" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reports" description="Business overview and analytics">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 3 Months</option>
          <option value={180}>Last 6 Months</option>
          <option value={365}>Last 1 Year</option>
        </select>
      </AdminPageHeader>

      {/* Revenue */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Revenue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard label="Total Revenue" value={`Rs ${(data?.revenue?.total || 0).toLocaleString()}`} icon="account_balance" accent="green" />
          <AdminStatCard label="Customer Revenue" value={`Rs ${(data?.revenue?.customer || 0).toLocaleString()}`} icon="shopping_cart" accent="blue" />
          <AdminStatCard label="B2B Revenue" value={`Rs ${(data?.revenue?.b2b || 0).toLocaleString()}`} icon="business" accent="purple" />
        </div>
      </div>

      {/* Customers */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Customers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard label="Total Customers" value={data?.customers?.total || 0} icon="people" accent="blue" />
          <AdminStatCard label="New Customers" value={data?.customers?.new || 0} icon="person_add" accent="green" />
          <AdminStatCard label="Customer Orders" value={data?.orders?.customerOrders || 0} icon="shopping_bag" accent="amber" />
          <AdminStatCard label="Pending Orders" value={data?.orders?.pendingCustomerOrders || 0} icon="hourglass_top" accent="red" />
        </div>
      </div>

      {/* B2B */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">B2B Business</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard label="Organizations" value={data?.b2b?.totalOrgs || 0} icon="corporate_fare" accent="purple" />
          <AdminStatCard label="Active Orgs" value={data?.b2b?.activeOrgs || 0} icon="check_circle" accent="green" />
          <AdminStatCard label="B2B Orders" value={data?.orders?.b2bOrders || 0} icon="local_shipping" accent="blue" />
          <AdminStatCard label="Pending Applications" value={data?.b2b?.pendingApplications || 0} icon="pending" accent="amber" />
        </div>
      </div>

      {/* B2B Workflow */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">B2B Workflow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard label="Pending RFQs" value={data?.b2bWorkflow?.pendingRFQs || 0} icon="request_quote" accent="amber" />
          <AdminStatCard label="Active Quotations" value={data?.b2bWorkflow?.activeQuotations || 0} icon="calculate" accent="blue" />
          <AdminStatCard label="Pending POs" value={data?.b2bWorkflow?.pendingPOs || 0} icon="assignment" accent="purple" />
          <AdminStatCard label="Outstanding Invoices" value={data?.b2bWorkflow?.outstandingInvoices || 0} icon="receipt" accent="red" />
        </div>
      </div>
    </div>
  );
}
