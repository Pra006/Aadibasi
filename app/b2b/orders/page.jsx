"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import B2BStatusBadge from "@/components/b2b/B2BStatusBadge";
import { formatNPR } from "@/lib/utils";

export default function B2BOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="hourglass_empty" size={24} className="animate-spin text-on-surface-variant" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl text-forest-deep">B2B Orders</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="local_shipping" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">No B2B orders yet</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/40">
                  <th className="px-6 py-3 font-semibold">Order #</th>
                  <th className="px-6 py-3 font-semibold">Placed By</th>
                  <th className="px-6 py-3 font-semibold">Items</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Invoice</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">{order.orderNumber}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{order.placedBy?.user ? [order.placedBy.user.firstName, order.placedBy.user.lastName].filter(Boolean).join(" ") : "—"}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{order.items.length}</td>
                    <td className="px-6 py-3 font-semibold">{formatNPR(order.total)}</td>
                    <td className="px-6 py-3"><B2BStatusBadge status={order.status} /></td>
                    <td className="px-6 py-3 text-xs">
                      {order.invoice ? (
                        <span className="text-herbal-jade font-semibold">{order.invoice.invoiceNumber}</span>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-3 text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
