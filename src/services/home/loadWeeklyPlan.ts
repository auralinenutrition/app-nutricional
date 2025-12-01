// src/services/home/loadWeeklyPlan.ts
import { supabase } from "@/lib/supabase";
import { AiPlanDays, AiDayMeal } from "./MealPlanMock";

type DayKey =
  | "domingo"
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type WeeklyPlanResult = {
  days: AiPlanDays;
  totals: Record<DayKey, number>;
  created_at?: string | null;
};

export default async function loadWeeklyPlan(
  userId: string
): Promise<WeeklyPlanResult> {
  try {
    // 1) Buscar plano AI mais recente dessa semana
    const { data, error } = await supabase
      .from("ai_generated_plans")
      .select("content, created_at")
      .eq("user_id", userId)
      .eq("plan_type", "weekly_meal_plan")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let days: AiPlanDays;
    let created_at: string | null = null;

    if (data?.content?.week) {
      // converte JSON do banco para AiPlanDays
      days = data.content.week as AiPlanDays;
      created_at = data.created_at;
    } else {
      console.warn("Nenhum plano IA encontrado — usando mock temporariamente");

      const mock = await import("./MealPlanMock").then((m) =>
        m.loadWeeklyPlanMock()
      );
      days = mock;
    }

    // 2) Calcular totais por dia
    const totals = (Object.keys(days) as DayKey[]).reduce((acc, day) => {
      const sum = (days[day] ?? []).reduce(
        (s, m: AiDayMeal) => s + (m.calories ?? 0),
        0
      );
      acc[day] = sum;
      return acc;
    }, {} as Record<DayKey, number>);

    return { days, totals, created_at };
  } catch (err) {
    console.error("Erro em loadWeeklyPlan:", err);

    // fallback mock
    const mock = await import("./MealPlanMock").then((m) =>
      m.loadWeeklyPlanMock()
    );
    const totals = (Object.keys(mock) as DayKey[]).reduce((acc, day) => {
      const sum = (mock[day] ?? []).reduce(
        (s, m: AiDayMeal) => s + (m.calories ?? 0),
        0
      );
      acc[day] = sum;
      return acc;
    }, {} as Record<DayKey, number>);

    return { days: mock, totals, created_at: null };
  }
}
