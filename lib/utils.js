export function formatNPR(amount) {
  if (amount == null || isNaN(amount)) return "NPR 0";
  return "NPR " + Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function discountPercent(original, sale) {
  if (!original || !sale || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export function timeAgo(date) {
  const d = new Date(date);
  const diff = Math.max(0, Date.now() - d.getTime());
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
