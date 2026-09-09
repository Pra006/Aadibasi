"use client";
import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FlashCountdown({ endsAt }) {
  // Start as null so server + first client render match; hydrate on mount.
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const target = new Date(endsAt).getTime();
  const diff = now == null ? 0 : Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const cells = [
    [pad(h), "Hours"],
    [pad(m), "Min"],
    [pad(s), "Sec"],
  ];
  return (
    <div className="flex items-center gap-2" suppressHydrationWarning>
      {cells.map(([v, l], i) => (
        <div key={l} className="flex items-center gap-2">
          <div className="flex flex-col items-center bg-forest-deep text-antique-gold rounded-lg px-3 py-2 min-w-[56px] shadow">
            <span className="font-headline text-2xl leading-none font-bold" suppressHydrationWarning>
              {now == null ? "--" : v}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-earth-sand mt-1">{l}</span>
          </div>
          {i < cells.length - 1 && <span className="text-forest-deep font-headline text-2xl">:</span>}
        </div>
      ))}
    </div>
  );
}
