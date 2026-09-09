import { formatNPR, discountPercent } from "@/lib/utils";

export default function Price({ price, compareAt, size = "md", className = "" }) {
  const pct = discountPercent(compareAt, price);
  const sizes = {
    sm: { p: "text-sm", c: "text-xs", b: "text-[10px]" },
    md: { p: "text-lg", c: "text-sm", b: "text-[11px]" },
    lg: { p: "text-2xl", c: "text-base", b: "text-xs" },
  }[size] || { p: "text-lg", c: "text-sm", b: "text-[11px]" };

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`font-headline font-bold text-forest-deep ${sizes.p}`}>{formatNPR(price)}</span>
      {compareAt && compareAt > price && (
        <>
          <span className={`line-through text-on-surface-variant ${sizes.c}`}>{formatNPR(compareAt)}</span>
          <span className={`text-terracotta font-bold ${sizes.b}`}>−{pct}%</span>
        </>
      )}
    </div>
  );
}
