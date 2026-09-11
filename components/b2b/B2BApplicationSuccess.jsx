"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function B2BApplicationSuccess({ referenceNumber }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-herbal-jade/10 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-herbal-jade/20 flex items-center justify-center">
            <Icon name="check_circle" size={36} filled className="text-herbal-jade" />
          </div>
        </div>

        <h1 className="font-headline text-2xl sm:text-3xl text-forest-deep mb-3">
          Application Submitted
        </h1>

        <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto mb-6">
          Your B2B Commercial Partnership Application has been submitted successfully.
          Our team will review your business profile and contact you regarding commercial
          pricing, MOQ, and partnership terms.
        </p>

        {/* Reference number */}
        <div className="inline-flex items-center gap-2 bg-surface-container-low border border-outline-variant/60 rounded-xl px-5 py-3 mb-8">
          <Icon name="tag" size={18} className="text-antique-gold" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Application Reference
            </div>
            <div className="text-lg font-bold text-forest-deep tracking-wide">
              {referenceNumber}
            </div>
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 mb-8 text-left">
          <h3 className="text-sm font-semibold text-forest-deep mb-4">What happens next?</h3>
          <div className="space-y-3">
            {[
              { icon: "check_circle", label: "Application received", done: true },
              { icon: "rate_review", label: "Business profile under review", done: false },
              { icon: "handshake", label: "Partnership terms shared", done: false },
              { icon: "verified", label: "B2B account activated", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <Icon
                  name={step.icon}
                  size={20}
                  filled={step.done}
                  className={step.done ? "text-herbal-jade" : "text-outline-variant"}
                />
                <span
                  className={`text-sm ${
                    step.done ? "text-forest-deep font-semibold" : "text-on-surface-variant"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest-base text-ivory-canvas border border-antique-gold/40 rounded font-semibold text-sm hover:bg-forest-deep transition-colors"
          >
            <Icon name="storefront" size={16} />
            Back to Store
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-forest-deep border border-forest-base/30 rounded font-semibold text-sm hover:bg-forest-base/5 transition-colors"
          >
            <Icon name="person" size={16} />
            My Account
          </Link>
        </div>
      </div>
    </div>
  );
}
