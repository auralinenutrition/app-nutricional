// src/components/ScrollWheelPicker.tsx
"use client";

import React, { useEffect, useRef } from "react";

type Opt = number | string;

export default function ScrollWheelPicker({
  value,
  onChange,
  options,
  unit,
  height = 200,
  itemHeight = 56,
}: {
  value: Opt;
  onChange: (v: Opt) => void;
  options: Opt[];
  unit?: string;
  height?: number;
  itemHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Ajusta posição inicial
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const index = options.indexOf(value);
    el.scrollTop = index * itemHeight;
  }, [itemHeight, options, value]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      const index = Math.round(el.scrollTop / itemHeight);
      const safeIndex = Math.max(0, Math.min(index, options.length - 1));

      const selected = options[safeIndex];
      onChange(selected);

      el.scrollTo({
        top: safeIndex * itemHeight,
        behavior: "smooth",
      });
    }, 120);
  };

  const selectedIndex = options.indexOf(value);

  return (
    <div className="flex flex-col items-center w-full select-none relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative w-full scrollbar-hide"
        style={{
          height: `${height}px`,
          overflowY: "scroll",
          overflowX: "hidden", // impede bleed horizontal
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          borderTop: "none",
          borderBottom: "none",
        }}
      >
        {/* espaço superior */}
        <div style={{ height: itemHeight * 2 }} />

        {/* linha superior da seleção */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: itemHeight * 2,
            borderTop: "1px solid #E5E5E5",
            zIndex: 20,
          }}
        />

        {/* linha inferior da seleção */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: itemHeight * 3,
            borderTop: "none",
            zIndex: 20,
          }}
        />

        {/* itens */}
        {options.map((opt, i) => {
          const distance = Math.abs(i - selectedIndex);
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.25;
          const fontSize = distance === 0 ? 24 : distance === 1 ? 18 : 16;
          const color = distance === 0 ? "#0A0A0A" : "#A5A5A5";
          const fontWeight = distance === 0 ? 600 : 400;

          return (
            <div
              key={i}
              onClick={() => {
                onChange(opt);
                const el = containerRef.current;
                if (el)
                  el.scrollTo({ top: i * itemHeight, behavior: "smooth" });
              }}
              className="flex items-center justify-center snap-center"
              style={{
                height: itemHeight,
                opacity,
                transition: "opacity .15s",
              }}
            >
              <span style={{ fontSize, fontWeight, color }}>{opt}</span>
            </div>
          );
        })}

        {/* espaço inferior */}
        <div style={{ height: itemHeight * 2 }} />
      </div>

      {unit && (
        <span className="text-sm text-[#6F6F6F] mt-3 font-medium">{unit}</span>
      )}
    </div>
  );
}
