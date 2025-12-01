"use client";

import { useEffect, useState } from "react";

import type { HomeData, MealSummary } from "@/types/home";
import type { User } from "@supabase/supabase-js";
import type { AiPlanDays, DayKey, AiDayMeal } from "@/types/plan";

import Header from "@/components/home/Header";
import DailyGoals from "@/components/home/DailyGoals";
import TodayMeals from "@/components/home/TodayMeals";
import WeeklyPlan from "@/components/home/WeeklyPlan";
import ShoppingPreview from "@/components/home/ShoppingPreview";
import CaloriesCard from "@/components/home/CaloriesCard";
import BottomBar from "@/components/home/BottomBar";
import FloatingActionButton from "@/components/home/FloatingActionButton";

type Props = {
  user: User | null;
  data: HomeData;
};

export default function HomeClient({ user, data }: Props) {
  const [state, setState] = useState<HomeData>(data ?? {} as HomeData);

  // ----------------------------
  // Reload automático da home
  // ----------------------------
  async function reload() {
    try {
      const res = await fetch("/api/home/reload");
      if (!res.ok) return;
      const nd: HomeData = await res.json();
      setState(nd);
    } catch (err) {
      console.error("reload error:", err);
    }
  }

  useEffect(() => {
    window.addEventListener("waterSaved", reload);
    window.addEventListener("mealSaved", reload);
    return () => {
      window.removeEventListener("waterSaved", reload);
      window.removeEventListener("mealSaved", reload);
    };
  }, []);

  // ----------------------------
  // Desestruturação segura
  // ----------------------------
  const {
    metas = {},
    meals = [],
    plan = null,
    shoppingList = [],
    totals,
    progress = {},
  } = state ?? {};

  // ----------------------------
  // Metas do usuário
  // ----------------------------
  const waterGoal = Number(metas.meta_agua ?? 2000);
  const mealsGoal = Number(metas.meta_refeicoes ?? 4);
  const caloriesGoal = Number(metas.meta_calorias ?? 2000);

  // ----------------------------
  // Progresso do dia
  // ----------------------------
  const waterValue = Number(progress.waterValue ?? 0);
  const mealsDone = Number(progress.mealsDone ?? meals.length);
  const caloriesValue =
    Number(progress.caloriesValue) ??
    meals.reduce((s, m) => s + (Number(m.calories ?? 0) || 0), 0);

  // ----------------------------
  // Percentuais
  // ----------------------------
  const waterPercent = Math.min(100, (waterValue / waterGoal) * 100);
  const mealsPercent = Math.min(100, (mealsDone / mealsGoal) * 100);
  const caloriesPercent = Math.min(100, (caloriesValue / caloriesGoal) * 100);

  // ----------------------------
  // Normalização do plano semanal
  // ----------------------------
  const dayOrder: DayKey[] = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  function normalizePlan(input: any): AiPlanDays {
    const out: Partial<AiPlanDays> = {};

    for (const day of dayOrder) {
      const raw = Array.isArray(input?.[day]) ? input[day] : [];

      out[day] = raw.map(
        (m: any): AiDayMeal => ({
          title: String(m?.title ?? ""),
          description: String(m?.description ?? ""),
          calories: m?.calories == null ? 0 : Number(m.calories),
        })
      );
    }

    return out as AiPlanDays;
  }

  const normalizedPlan = normalizePlan(plan);

  // ----------------------------
  // Totais por dia (fallback seguro)
  // ----------------------------
  const safeTotals: Record<DayKey, number> =
    (totals as any) ??
    (Object.fromEntries(dayOrder.map((d) => [d, 0])) as Record<DayKey, number>);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="pb-24 pt-6 px-3">
      <Header user={user} />

      <DailyGoals
        water={waterPercent}
        meals={mealsPercent}
        calories={caloriesPercent}
        mealsDone={mealsDone}
        mealsGoal={mealsGoal}
        waterValue={waterValue}
        waterGoal={waterGoal}
        caloriesValue={caloriesValue}
        caloriesGoal={caloriesGoal}
      />

      <TodayMeals
        meals={meals.map((m: MealSummary) => ({
          title: m.title,
          calories: m.calories ?? undefined,
          description: m.description ?? undefined,
        }))}
      />

      <WeeklyPlan plan={normalizedPlan} totals={safeTotals} />

      <div className="grid grid-cols-2 gap-4">
        <ShoppingPreview items={shoppingList ?? []} />
        <CaloriesCard calories={caloriesValue} goal={caloriesGoal} />
      </div>

      <FloatingActionButton />
      <BottomBar />
    </div>
  );
}
