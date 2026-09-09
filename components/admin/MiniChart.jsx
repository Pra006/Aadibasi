// Lightweight inline SVG chart — no libraries.
export default function MiniChart({ data = [12, 24, 18, 30, 28, 42, 38, 55, 48, 62, 58, 70], height = 120, stroke = "#C5A869" }) {
  const w = 300;
  const h = height;
  const max = Math.max(...data);
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - (v / max) * (h - 10) - 5}`).join(" ");
  const area = `M0,${h} L${points} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="mcGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mcGrad)" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - (v / max) * (h - 10) - 5} r="2.5" fill={stroke} />
      ))}
    </svg>
  );
}
