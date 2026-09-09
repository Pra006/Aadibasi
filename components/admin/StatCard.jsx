import Icon from "@/components/ui/Icon";

export default function StatCard({ label, value, delta, deltaTone = "up", icon, accent = "forest" }) {
  const accentBg = {
    forest: "bg-forest-base/10 text-forest-base",
    gold: "bg-antique-gold/20 text-antique-gold",
    terracotta: "bg-terracotta/15 text-terracotta",
    jade: "bg-herbal-jade/15 text-herbal-jade",
  }[accent];
  const deltaColor = deltaTone === "up" ? "text-herbal-jade" : "text-terracotta";
  const arrow = deltaTone === "up" ? "trending_up" : "trending_down";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{label}</div>
          <div className="font-headline text-3xl text-forest-deep mt-2 leading-none">{value}</div>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentBg}`}>
            <Icon name={icon} size={20} />
          </div>
        )}
      </div>
      {delta && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${deltaColor}`}>
          <Icon name={arrow} size={14} />
          <span>{delta}</span>
          <span className="text-on-surface-variant font-normal">vs last month</span>
        </div>
      )}
    </div>
  );
}
