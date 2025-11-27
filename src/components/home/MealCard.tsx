// components/home/MealCard.tsx
"use client";

import React from "react";
import { Check, Coffee, Moon } from "lucide-react";

export default function MealCard({
  meal,
  onToggle,
}: {
  meal: any;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-green-600">
          {/* ícone simples placeholder */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18" stroke="#00C974" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div>
          <div className="text-sm font-medium">{meal.title}</div>
          <div className="text-xs text-gray-500 mt-1">{meal.description ?? ""}</div>
          <div className="text-xs text-gray-400 mt-2">
            {meal.calories ?? "-"} kcal • {meal.protein ?? "-"}g P
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onToggle}
          className={`px-3 py-2 rounded-full ${meal.eaten ? "bg-[#00C974] text-white" : "bg-gray-100 text-gray-700"}`}
        >
          {meal.eaten ? <Check size={16} /> : "Registrar"}
        </button>
      </div>
    </div>
  );
}
