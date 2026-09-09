"use client";
import { useState } from "react";

export default function ProductGallery({ images = [], alt = "" }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <div className="flex flex-col gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square rounded-lg overflow-hidden border-2 ${
              active === i ? "border-antique-gold" : "border-outline-variant/60"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} className="w-full h-full object-cover" alt="" />
          </button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden bg-surface-container aspect-square border border-outline-variant/60">
        <img src={images[active]} className="w-full h-full object-cover" alt={alt} />
      </div>
    </div>
  );
}
