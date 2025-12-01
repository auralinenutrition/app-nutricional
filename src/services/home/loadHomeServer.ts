// src/services/home/loadHomeServer.ts
import { createServerSupabase } from "@/lib/supabase/server";
import { AiPlanDays, DayKey } from "@/types/plan";

export default async function loadHomeServer(userId: string) {
  const supabase = await createServerSupabase();

  // ------------------------------------
  // 1) Buscar metas do usuário (tabela users)
  // ------------------------------------
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("meta_agua, meta_calorias, meta_refeicoes")
    .eq("id", userId)
    .single();

  const metas = {
    metaAgua: user?.meta_agua ?? 2000,
    metaCalorias: user?.meta_calorias ?? 2000,
    metaRefeicoes: user?.meta_refeicoes ?? 4,
  };

  // ------------------------------------
  // 2) Buscar refeições de hoje
  // ------------------------------------
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const { data: mealsToday, error: mealsErr } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", start.toISOString())
    .order("created_at", { ascending: false });

  const meals = mealsToday ?? [];

  const caloriesValue = meals.reduce((sum, m) => sum + (m.calories ?? 0), 0);

  // ------------------------------------
  // 3) Buscar quantidade de água ingerida hoje
  // (caso não tenha uma tabela water_records ainda, usamos 0)
  // ------------------------------------
  let waterValue = 0;
  const { data: waterRows } = await supabase
    .from("water_records")
    .select("amount, created_at")
    .eq("user_id", userId)
    .gte("created_at", start.toISOString());

  if (waterRows && waterRows.length > 0) {
    waterValue = waterRows.reduce((s, w) => s + (w.amount ?? 0), 0);
  }

// ------------------------------------
// 4) Buscar plano semanal gerado pela IA
// ------------------------------------
const { data: planRow } = await supabase
  .from("ai_generated_plans")
  .select("content")
  .eq("user_id", userId)
  .eq("plan_type", "weekly_meal_plan")
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

const rawWeek = planRow?.content?.week ?? {};
const shoppingList = planRow?.content?.shopping_list ?? [];

const normalizeMeal = (item: any) => {
  if (typeof item === "string") {
    return {
      title: item,
      description: "",
      calories: 0,
    };
  }
  return {
    title: String(item?.title ?? ""),
    description: String(item?.description ?? ""),
    calories: Number(item?.calories ?? 0),
  };
};


const plan: AiPlanDays = {
  domingo: (rawWeek.domingo ?? []).map(normalizeMeal),
  segunda: (rawWeek.segunda ?? []).map(normalizeMeal),
  terca:   (rawWeek.terca ?? []).map(normalizeMeal),
  quarta:  (rawWeek.quarta ?? []).map(normalizeMeal),
  quinta:  (rawWeek.quinta ?? []).map(normalizeMeal),
  sexta:   (rawWeek.sexta ?? []).map(normalizeMeal),
  sabado:  (rawWeek.sabado ?? []).map(normalizeMeal),
};



// ------------------------------------
// 5) Totais de calorias do plano (por dia)
// ------------------------------------
const totals: Record<DayKey, number> = {
  domingo: 0,
  segunda: 0,
  terca: 0,
  quarta: 0,
  quinta: 0,
  sexta: 0,
  sabado: 0,
};

(Object.keys(plan) as DayKey[]).forEach((day) => {
  totals[day] = plan[day].reduce((s, m) => s + (m.calories ?? 0), 0);
});


  // ------------------------------------
  // 6) Cálculo dos percentuais
  // ------------------------------------
  const waterPercent = Math.min(100, (waterValue / metas.metaAgua) * 100);
  const mealsPercent = Math.min(100, (meals.length / metas.metaRefeicoes) * 100);
  const caloriesPercent = Math.min(100, (caloriesValue / metas.metaCalorias) * 100);

  return {
    metas,
    meals,
    plan,
    shoppingList,
    totals,
    progress: {
      water: waterPercent,
      meals: mealsPercent,
      calories: caloriesPercent,
      waterValue,
      caloriesValue,
      mealsDone: meals.length,
      metaAgua: metas.metaAgua,
      metaRefeicoes: metas.metaRefeicoes,
      metaCalorias: metas.metaCalorias,
    }
  };
}
