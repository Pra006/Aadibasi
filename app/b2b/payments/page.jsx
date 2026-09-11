"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { formatNPR } from "@/lib/utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/payments")
      .then((r) => r.json())
      .then((data) => setPayments(data.payments || []))
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
        <h1 className="font-headline text-3xl text-forest-deep">Payments</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{payments.length} payments</p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="payments" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">No payments recorded yet</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/40">
                  <th className="px-6 py-3 font-semibold">Invoice</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Method</th>
                  <th className="px-6 py-3 font-semibold">Reference</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">
                      {p.invoice?.invoiceNumber || "—"}
                    </td>
                    <td className="px-6 py-3 font-semibold text-herbal-jade">{formatNPR(p.amount)}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{p.method.replace(/_/g, " ")}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{p.reference || "—"}</td>
                    <td className="px-6 py-3 text-on-surface-variant">
                      {new Date(p.paidAt).toLocaleDateString()}
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
