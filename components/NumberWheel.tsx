"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface NumberInputProps {
  value: number | string;
  onChange: (v: any) => void;
  min: number;
  max: number;
  unit: string;
  label: string;
  theme?: "dark" | "blend";
}

export function NumberWheel({
  value,
  onChange,
  min,
  max,
  unit,
  label,
  theme = "dark",
}: NumberInputProps) {
  const isBlend = theme === "blend";
  const numValue = typeof value === "string" ? parseInt(value, 10) || min : value;

  const [inputStr, setInputStr] = useState<string>(String(numValue));

  useEffect(() => {
    setInputStr(String(numValue));
  }, [numValue]);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputStr(raw);
    if (raw !== "") {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) {
        onChange(clamp(parsed));
      }
    }
  };

  const handleBlur = () => {
    if (inputStr === "" || isNaN(parseInt(inputStr, 10))) {
      setInputStr(String(numValue));
    } else {
      const clamped = clamp(parseInt(inputStr, 10));
      setInputStr(String(clamped));
      onChange(clamped);
    }
  };

  const step = (delta: number) => {
    const next = clamp(numValue + delta);
    setInputStr(String(next));
    onChange(next);
  };

  return (
    <div
      style={{
        background: isBlend ? "#ffffff" : "#111113",
        border: isBlend ? "2px solid #cbd5e1" : "2px solid #27272a",
        borderRadius: "20px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: isBlend ? "0 4px 15px rgba(0,0,0,0.04)" : "none",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: isBlend ? "#475569" : "#71717a",
        }}
      >
        {label}
      </span>

      {/* Main input & unit row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        {/* Decrease button */}
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={numValue <= min}
          aria-label={`Decrease ${label}`}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: isBlend ? "#f1f5f9" : "#18181b",
            border: isBlend ? "1.5px solid #cbd5e1" : "1.5px solid #27272a",
            color: numValue <= min ? "#cbd5e1" : isBlend ? "#0f172a" : "#e4e4e7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: numValue <= min ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>

        {/* Input box */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            maxWidth: "110px",
            minHeight: "46px",
            overflow: "visible",
          }}
        >
          <input
            type="number"
            min={min}
            max={max}
            value={inputStr}
            onChange={handleInputChange}
            onBlur={handleBlur}
            style={{
              width: "100%",
              height: "44px",
              lineHeight: "44px",
              textAlign: "center",
              fontSize: "26px",
              fontWeight: 900,
              color: isBlend ? "#3f6212" : "#bef264",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              padding: 0,
              margin: 0,
              boxSizing: "border-box",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
              appearance: "none",
            }}
          />
        </div>

        {/* Increase button */}
        <button
          type="button"
          onClick={() => step(1)}
          disabled={numValue >= max}
          aria-label={`Increase ${label}`}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: isBlend ? "#f1f5f9" : "#18181b",
            border: isBlend ? "1.5px solid #cbd5e1" : "1.5px solid #27272a",
            color: numValue >= max ? "#cbd5e1" : isBlend ? "#0f172a" : "#e4e4e7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: numValue >= max ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Unit Badge */}
      <span
        style={{
          fontSize: "11px",
          fontWeight: 800,
          color: isBlend ? "#65a30d" : "#a1a1aa",
          background: isBlend ? "#f7fee7" : "#18181b",
          border: isBlend ? "1px solid #d9f99d" : "1px solid #27272a",
          padding: "2px 10px",
          borderRadius: "999px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {unit}
      </span>
    </div>
  );
}
