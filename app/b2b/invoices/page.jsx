"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import B2BStatusBadge from "@/components/b2b/B2BStatusBadge";
import { formatNPR } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/invoices")
      .then((r) => r.json())
      .then((data) => setInvoices(data.invoices || []))
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
        <h1 className="font-headline text-3xl text-forest-deep">Invoices</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{invoices.length} invoices</p>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="receipt" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">No invoices yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => {
            const totalPaid = inv.payments?.reduce((s, p) => s + p.amount, 0) || 0;
            const remaining = inv.total - totalPaid;

            return (
              <div key={inv.id} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="font-semibold text-forest-deep">{inv.invoiceNumber}</div>
                    {inv.order && (
                      <div className="text-xs text-on-surface-variant">Order: {inv.order.orderNumber}</div>
                    )}
                  </div>
                  <B2BStatusBadge status={inv.paymentStatus} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-on-surface-variant block">Total</span>
                    <span className="font-semibold text-forest-deep">{formatNPR(inv.total)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block">Paid</span>
                    <span className="font-semibold text-herbal-jade">{formatNPR(totalPaid)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block">Remaining</span>
                    <span className={`font-semibold ${remaining > 0 ? "text-terracotta" : "text-herbal-jade"}`}>
                      {formatNPR(remaining)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block">Due Date</span>
                    <span className="font-semibold text-forest-deep">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>

                {inv.paymentTerms && (
                  <div className="mt-2 text-xs text-on-surface-variant">
                    Terms: {inv.paymentTerms.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
