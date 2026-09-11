"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import B2BStatusBadge from "@/components/b2b/B2BStatusBadge";

export default function RFQListPage() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const params = filter ? `?status=${filter}` : "";
    fetch(`/api/b2b/rfq${params}`)
      .then((r) => r.json())
      .then((data) => setRfqs(data.rfqs || []))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-headline text-3xl text-forest-deep">Requests for Quotation</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">{rfqs.length} RFQs</p>
        </div>
        <Link
          href="/b2b/rfq/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-base text-ivory-canvas border border-antique-gold/40 rounded font-semibold text-sm hover:bg-forest-deep transition-colors"
        >
          <Icon name="add" size={16} />
          New RFQ
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "DRAFT", "SUBMITTED", "UNDER_REVIEW", "QUOTED", "ACCEPTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === s
                ? "bg-forest-base text-ivory-canvas"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="hourglass_empty" size={24} className="animate-spin text-on-surface-variant" />
        </div>
      ) : rfqs.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
          <Icon name="request_quote" size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm">No RFQs found</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/40">
                  <th className="px-6 py-3 font-semibold">RFQ #</th>
                  <th className="px-6 py-3 font-semibold">Products</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Quote</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {rfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">{rfq.rfqNumber}</td>
                    <td className="px-6 py-3 text-on-surface-variant">
                      {rfq.items.length} product{rfq.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-3"><B2BStatusBadge status={rfq.status} /></td>
                    <td className="px-6 py-3">
                      {rfq.quotation ? (
                        <span className="text-xs font-semibold text-herbal-jade">{rfq.quotation.quoteNumber}</span>
                      ) : (
                        <span className="text-xs text-outline-variant">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-on-surface-variant">
                      {new Date(rfq.createdAt).toLocaleDateString()}
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
