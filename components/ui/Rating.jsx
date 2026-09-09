import Icon from "./Icon";

export default function Rating({ value = 0, count, size = 14, showCount = true }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center text-antique-gold">
        {Array.from({ length: full }).map((_, i) => (
          <Icon key={"f" + i} name="star" size={size} filled />
        ))}
        {half && <Icon name="star_half" size={size} filled />}
        {Array.from({ length: empty }).map((_, i) => (
          <Icon key={"e" + i} name="star" size={size} className="opacity-40" />
        ))}
      </div>
      <span className="text-xs font-semibold text-forest-deep">{value.toFixed(1)}</span>
      {showCount && count != null && (
        <span className="text-[11px] text-on-surface-variant">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
