"use client";

import React, { useEffect, useRef } from "react";

type Opt = number | string;

export default function ScrollWheelPickerDate({
  value,
  onChange,
  options,
  itemHeight = 50,
  height = 160,
}: {
  value: Opt;
  onChange: (v: Opt) => void;
  options: Opt[];
  itemHeight?: number;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const index = options.indexOf(value);
    el.scrollTop = index * itemHeight;
  }, [value, options, itemHeight]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      const index = Math.round(el.scrollTop / itemHeight);
      const safeIndex = Math.max(0, Math.min(index, options.length - 1));

      const selected = options[safeIndex];
      if (selected !== value) onChange(selected);

      el.scrollTo({
        top: safeIndex * itemHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const selectedIndex = options.indexOf(value);

  return (
    <div className="flex flex-col items-center w-full select-none">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative w-full no-scrollbar"
        style={{
          height,
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ height: itemHeight * 1 }} />

        {options.map((opt, i) => {
          const isSelected = i === selectedIndex;
          const distance = Math.abs(i - selectedIndex);

          const opacity = distance === 0 ? 1 : distance === 1 ? 0.45 : 0.25;
          const fontSize = distance === 0 ? 22 : 17;
          const color = distance === 0 ? "#0A0A0A" : "#A5A5A5";
          const fontWeight = distance === 0 ? 600 : 400;

          return (
            <div
              key={i}
              onClick={() => onChange(opt)}
              className="flex items-center justify-center snap-center"
              style={{
                height: itemHeight,
                opacity,
                transition: "opacity .15s",
              }}
            >
              <div
                style={{
                  padding: "8px 42px",
                  borderRadius: "8px",
                  background: isSelected ? "#F2F5F4" : "transparent",
                  boxShadow: isSelected
                    ? "1px 1px 8px rgba(0,0,0,0.1234)"
                    : "none",
                  border: isSelected ? "none" : "none",
                }}
              >
                <span style={{ fontSize, fontWeight, color }}>{opt}</span>
              </div>
            </div>
          );
        })}

        <div style={{ height: itemHeight * 1 }} />
      </div>
    </div>
  );
}
