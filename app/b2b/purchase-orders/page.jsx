"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import B2BStatusBadge from "@/components/b2b/B2BStatusBadge";
import { formatNPR } from "@/lib/utils";

export default function PurchaseOrdersPage() {
  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/purchase-orders")
      .then((r) => r.json())
      .then((data) => setPOs(data.purchaseOrders || []))
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
        <h1 className="font-headline text-3xl text-forest-deep">Purchase Orders</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{pos.length} purchase orders</p>
      </div>

      {pos.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="receipt_long" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">No purchase orders yet</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/40">
                  <th className="px-6 py-3 font-semibold">PO #</th>
                  <th className="px-6 py-3 font-semibold">Items</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Quote</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">{po.poNumber}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{po.items.length}</td>
                    <td className="px-6 py-3 font-semibold">{formatNPR(po.total)}</td>
                    <td className="px-6 py-3"><B2BStatusBadge status={po.status} /></td>
                    <td className="px-6 py-3 text-xs text-on-surface-variant">
                      {po.quotation?.quoteNumber || "—"}
                    </td>
                    <td className="px-6 py-3 text-on-surface-variant">
                      {new Date(po.createdAt).toLocaleDateString()}
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
