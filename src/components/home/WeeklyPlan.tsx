"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type AiDayMeal = {
  title: string;
  description?: string;
  calories?: number;
};

type DayKey =
  | "domingo"
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type AiPlanDays = Record<DayKey, AiDayMeal[]>;

type WeeklyPlanProps = {
  plan: AiPlanDays;
  totals?: Record<DayKey, number>;
};

const dayOrder: DayKey[] = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

const displayName: Record<DayKey, string> = {
  domingo: "Dom",
  segunda: "Seg",
  terca: "Ter",
  quarta: "Qua",
  quinta: "Qui",
  sexta: "Sex",
  sabado: "Sáb",
};

export default function WeeklyPlan({ plan, totals }: WeeklyPlanProps) {
  const todayIndex = new Date().getDay(); // 0–6
  const containerRef = useRef<HTMLDivElement | null>(null);

  // AUTO-SCROLL PARA O DIA DE HOJE
  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".weekly-card-item");
    const todayItem = items[todayIndex] as HTMLElement | undefined;

    if (todayItem) {
      todayItem.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  return (
    <div className="mt-6 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-lg font-semibold text-[#0A0A0A]">
          Seu plano da semana
        </h3>
        <Link
          href="/weekly-plan"
          className="text-sm text-[#00C974] font-medium"
        >
          Ver cardápio completo
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div
          ref={containerRef}
          className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2"
        >
          {dayOrder.map((dayKey, idx) => {
            const meals = plan[dayKey] ?? [];
            const summary = meals
              .slice(0, 2)
              .map((m) => `${m.title} • ${m.calories ?? 0} kcal`)
              .join(" | ");
            const isToday = idx === todayIndex;

            const total =
              totals?.[dayKey] ??
              meals.reduce((s, m) => s + (m.calories ?? 0), 0);

            return (
              <div
                key={dayKey}
                className="min-w-[200px] flex-shrink-0 weekly-card-item"
              >
                <div
                  className={clsx(
                    "p-3 rounded-2xl border transition",
                    isToday ? "border-[#00C974] shadow-md" : "border-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                          isToday
                            ? "bg-[#00C974] text-white"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {displayName[dayKey]}
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          {isToday ? "Hoje" : displayName[dayKey]}
                        </div>
                        <div className="text-xs text-gray-400">
                          {total} kcal
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {meals.length} ref.
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mb-1">
                    {summary || "Sem plano gerado"}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      href={`/weekly-menu?day=${dayKey}`}
                      className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600"
                    >
                      Ver dia
                    </Link>

                    <button
                      onClick={() =>
                        (window.location.href = `/weekly-menu?day=${dayKey}`)
                      }
                      className="ml-auto text-xs px-3 py-1 rounded-full bg-[#00C974] text-white"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
