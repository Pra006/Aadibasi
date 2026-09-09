export default function Icon({ name, className = "", size = 20, filled = false, style }) {
  const s = { fontSize: size, fontVariationSettings: filled ? "'FILL' 1" : undefined, ...style };
  return (
    <span className={`material-symbols-outlined align-middle ${className}`} style={s} aria-hidden="true">
      {name}
    </span>
  );
}
