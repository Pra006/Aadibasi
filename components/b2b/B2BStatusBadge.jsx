"use client";

const statusStyles = {
  // Application statuses
  PENDING:          "bg-antique-gold/15 text-antique-gold",
  UNDER_REVIEW:     "bg-herbal-jade/15 text-herbal-jade",
  CONTACT_REQUIRED: "bg-terracotta/15 text-terracotta",
  APPROVED:         "bg-herbal-jade/20 text-herbal-jade",
  REJECTED:         "bg-error/15 text-error",

  // RFQ / Quote
  DRAFT:       "bg-surface-container-high text-on-surface-variant",
  SUBMITTED:   "bg-antique-gold/15 text-antique-gold",
  QUOTED:      "bg-herbal-jade/15 text-herbal-jade",
  SENT:        "bg-herbal-jade/15 text-herbal-jade",
  ACCEPTED:    "bg-herbal-jade/20 text-herbal-jade",
  EXPIRED:     "bg-surface-container-high text-on-surface-variant",
  CANCELLED:   "bg-surface-container-high text-on-surface-variant",

  // PO / Order
  CONFIRMED:  "bg-herbal-jade/15 text-herbal-jade",
  PROCESSING: "bg-antique-gold/15 text-antique-gold",
  COMPLETED:  "bg-forest-base/15 text-forest-base",
  SHIPPED:    "bg-herbal-jade/15 text-herbal-jade",
  DELIVERED:  "bg-forest-base/15 text-forest-base",
  RETURNED:   "bg-terracotta/15 text-terracotta",

  // Invoice payment
  PARTIALLY_PAID: "bg-antique-gold/15 text-antique-gold",
  PAID:           "bg-herbal-jade/20 text-herbal-jade",
  OVERDUE:        "bg-error/15 text-error",
};

const statusLabels = {
  LESS_THAN_100:  "< 100 units/mo",
  FROM_100_TO_500: "100–500 units/mo",
  FROM_500_TO_1000: "500–1,000 units/mo",
  FROM_1000_TO_5000: "1,000–5,000 units/mo",
  MORE_THAN_5000: "5,000+ units/mo",
  CUSTOM_PROJECT: "Custom / Project",
  UNDER_REVIEW: "Under Review",
  CONTACT_REQUIRED: "Contact Required",
  PARTIALLY_PAID: "Partially Paid",
  WHATSAPP_EMAIL: "WhatsApp + Email",
  ORGANIZATION_OWNER: "Owner",
  PRIVATE_LABEL_BUYER: "Private Label",
  INSTITUTIONAL_BUYER: "Institutional",
  ONLINE_SELLER: "Online Seller",
  SALON_SPA: "Salon / Spa",
  CORPORATE_BUYER: "Corporate",
};

export default function B2BStatusBadge({ status, className = "" }) {
  const style = statusStyles[status] || "bg-surface-container-high text-on-surface-variant";
  const label = statusLabels[status] || status?.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded ${style} ${className}`}
    >
      {label}
    </span>
  );
}
