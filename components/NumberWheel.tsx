"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const ITEM_H = 44; // height of each row in the drum
const VISIBLE = 3; // rows shown (centre = selected)

interface NumberWheelProps {
  value: number;
  onChange: (v: number) => void;
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
}: NumberWheelProps) {
  const isBlend = theme === "blend";
  const controls = useAnimation();

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAccumulator = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);

  // Reset drag animation transform whenever `value` prop changes
  useEffect(() => {
    controls.set({ y: 0 });
  }, [value, controls]);

  // Handle Mouse Wheel / Trackpad scrolling
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      const now = Date.now();
      if (now - lastWheelTime.current > 150) {
        wheelAccumulator.current = 0;
      }
      lastWheelTime.current = now;

      wheelAccumulator.current += e.deltaY;
      const threshold = 30;

      if (Math.abs(wheelAccumulator.current) >= threshold) {
        const dir = wheelAccumulator.current > 0 ? 1 : -1;
        const nextVal = clamp(value + dir);
        if (nextVal !== value) {
          onChange(nextVal);
        }
        wheelAccumulator.current = 0;
      }
    },
    [value, clamp, onChange]
  );

  // Direct +/- stepping
  const step = useCallback(
    (dir: 1 | -1) => {
      const next = clamp(value + dir);
      if (next !== value) onChange(next);
    },
    [value, clamp, onChange]
  );

  // Keyboard navigation when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  // Windowed visible items (-3 to +3 around current value)
  const visibleOffset = 3;
  const itemsToRender: number[] = [];
  for (let i = -visibleOffset; i <= visibleOffset; i++) {
    const num = value + i;
    if (num >= min && num <= max) {
      itemsToRender.push(num);
    }
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        background: isBlend ? "#ffffff" : "#111113",
        border: isBlend ? "2px solid #cbd5e1" : "2px solid #27272a",
        borderRadius: "20px",
        padding: "16px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        userSelect: "none",
        outline: "none",
        width: "100%",
        boxShadow: isBlend ? "0 4px 15px rgba(0,0,0,0.04)" : "none",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = isBlend
          ? "#84cc16"
          : "rgba(190,242,100,0.6)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = isBlend ? "#cbd5e1" : "#27272a")
      }
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

      {/* Drum Container with Wheel Listener */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        style={{
          position: "relative",
          width: "100%",
          height: `${ITEM_H * VISIBLE}px`,
          overflow: "hidden",
          cursor: "ns-resize",
          touchAction: "none",
        }}
      >
        {/* Selection highlight band */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: `${ITEM_H}px`,
            transform: "translateY(-50%)",
            background: isBlend
              ? "rgba(132, 204, 22, 0.15)"
              : "rgba(190,242,100,0.08)",
            borderTop: isBlend
              ? "1px solid rgba(132, 204, 22, 0.4)"
              : "1px solid rgba(190,242,100,0.3)",
            borderBottom: isBlend
              ? "1px solid rgba(132, 204, 22, 0.4)"
              : "1px solid rgba(190,242,100,0.3)",
            borderRadius: "10px",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Top & Bottom Fade overlays */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: `${ITEM_H * 0.9}px`,
            background: isBlend
              ? "linear-gradient(to bottom, #ffffff 0%, transparent 100%)"
              : "linear-gradient(to bottom, #111113 0%, transparent 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${ITEM_H * 0.9}px`,
            background: isBlend
              ? "linear-gradient(to top, #ffffff 0%, transparent 100%)"
              : "linear-gradient(to top, #111113 0%, transparent 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Draggable drum container */}
        <motion.div
          drag="y"
          animate={controls}
          dragConstraints={{ top: -ITEM_H * 2, bottom: ITEM_H * 2 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            const delta = info.offset.y;
            const threshold = 12;
            if (Math.abs(delta) >= threshold) {
              // Dragging down (delta > 0) decreases number; dragging up (delta < 0) increases number
              const count = Math.round(-delta / ITEM_H);
              const stepVal = count === 0 ? (delta < 0 ? 1 : -1) : count;
              const nextVal = clamp(value + stepVal);
              onChange(nextVal);
            }
            // Always snap motion back to y = 0
            controls.start({ y: 0, transition: { duration: 0.15 } });
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {itemsToRender.map((num) => {
            const isSelected = num === value;
            const dist = Math.abs(num - value);
            return (
              <div
                key={num}
                onClick={() => onChange(num)}
                style={{
                  height: `${ITEM_H}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isSelected ? "24px" : dist === 1 ? "18px" : "14px",
                  fontWeight: isSelected ? 900 : 600,
                  color: isSelected
                    ? isBlend
                      ? "#3f6212"
                      : "#bef264"
                    : dist === 1
                    ? isBlend
                      ? "#64748b"
                      : "#a1a1aa"
                    : isBlend
                    ? "#94a3b8"
                    : "#3f3f46",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {num}{" "}
                {isSelected ? (
                  <span
                    style={{
                      fontSize: "12px",
                      marginLeft: "4px",
                      color: isBlend ? "#65a30d" : "#a1a1aa",
                      fontWeight: 700,
                    }}
                  >
                    {unit}
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Stepper buttons underneath wheel */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          justifyContent: "center",
          marginTop: "4px",
        }}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={value <= min}
          style={{
            flex: 1,
            height: "32px",
            borderRadius: "8px",
            background: isBlend ? "#f1f5f9" : "#18181b",
            border: isBlend ? "1px solid #cbd5e1" : "1px solid #27272a",
            color: value <= min ? "#cbd5e1" : isBlend ? "#0f172a" : "#e4e4e7",
            fontWeight: 800,
            fontSize: "14px",
            cursor: value <= min ? "not-allowed" : "pointer",
          }}
        >
          -
        </button>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: isBlend ? "#4d7c0f" : "#bef264",
            fontFamily: "monospace",
          }}
        >
          {value} {unit}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={value >= max}
          style={{
            flex: 1,
            height: "32px",
            borderRadius: "8px",
            background: isBlend ? "#f1f5f9" : "#18181b",
            border: isBlend ? "1px solid #cbd5e1" : "1px solid #27272a",
            color: value >= max ? "#cbd5e1" : isBlend ? "#0f172a" : "#e4e4e7",
            fontWeight: 800,
            fontSize: "14px",
            cursor: value >= max ? "not-allowed" : "pointer",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
