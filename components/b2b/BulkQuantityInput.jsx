"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function BulkQuantityInput({ moq = 1, value = moq, onChange, max }) {
  const [error, setError] = useState("");

  function handleChange(newVal) {
    const num = parseInt(newVal, 10);
    if (isNaN(num) || num < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (num < moq) {
      setError(`Minimum order: ${moq} units`);
      onChange?.(num);
      return;
    }
    if (max && num > max) {
      setError(`Maximum: ${max} units`);
      return;
    }
    setError("");
    onChange?.(num);
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleChange(value - (moq > 1 ? moq : 1))}
          disabled={value <= moq}
          className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 transition-colors"
        >
          <Icon name="remove" size={16} />
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          min={moq}
          max={max}
          className="w-20 h-8 text-center text-sm font-semibold border border-outline-variant/60 rounded bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-forest-base/20"
        />

        <button
          type="button"
          onClick={() => handleChange(value + (moq > 1 ? moq : 1))}
          disabled={max && value >= max}
          className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 transition-colors"
        >
          <Icon name="add" size={16} />
        </button>
      </div>

      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}

      {!error && moq > 1 && (
        <p className="text-[11px] text-on-surface-variant mt-1">
          MOQ: {moq} units
        </p>
      )}
    </div>
  );
}
