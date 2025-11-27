// src/services/home/loadWeeklyPlan.ts
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { loadWeeklyPlanMock, AiPlanDays, AiDayMeal } from "./MealPlanMock";

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
  totals: Record<DayKey, number>; // soma de calorias por dia
  week_start?: string | null;
};

export default async function loadWeeklyPlan(userId: string): Promise<WeeklyPlanResult> {
  try {
    // buscar plano IA mais recente
    const { data: plan, error } = await supabase
      .from("ai_generated_meal_plan")
      .select("week_start, days")
      .eq("user_id", userId)
      .order("week_start", { ascending: false })
      .limit(1)
      .single();

    let days: AiPlanDays;
    let week_start: string | null = null;

    if (plan && plan.days) {
      days = plan.days as AiPlanDays;
      week_start = plan.week_start ?? null;
    } else {
      // fallback MOCK
      days = await loadWeeklyPlanMock();
    }

    // calcular totais por dia
    const totals = (Object.keys(days) as DayKey[]).reduce((acc, day) => {
      const sum = (days[day] ?? []).reduce((s, m: AiDayMeal) => s + (m.calories ?? 0), 0);
      acc[day] = sum;
      return acc;
    }, {} as Record<DayKey, number>);

    return { days, totals, week_start };
  } catch (err) {
    console.error("Erro em loadWeeklyPlan:", err);
    const mock = await loadWeeklyPlanMock();
    const totals = (Object.keys(mock) as DayKey[]).reduce((acc, day) => {
      const sum = (mock[day] ?? []).reduce((s, m) => s + (m.calories ?? 0), 0);
      acc[day] = sum;
      return acc;
    }, {} as Record<DayKey, number>);
    return { days: mock, totals, week_start: null };
  }
}
