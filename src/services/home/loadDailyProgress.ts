import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

type DailyProgress = {
  water: number;        // percentual 0–100
  meals: number;        // percentual 0–100
  calories: number;     // percentual 0–100
  caloriesValue: number; // calorias totais consumidas
  mealsDone: number;     // refeições concluídas
  waterValue: number;    // ml realmente ingeridos
};

export default async function loadDailyProgress(userId: string): Promise<DailyProgress> {
  try {
    // -----------------------
    // Buscar metas do usuário
    // -----------------------
    const { data: user } = await supabase
      .from("users")
      .select("meta_agua, meta_calorias, meta_refeicoes")
      .eq("id", userId)
      .single();

    const metaAgua = user?.meta_agua ?? 2000;
    const metaCalorias = user?.meta_calorias ?? 2000;
    const metaRefeicoes = user?.meta_refeicoes ?? 4;

    // -----------------------
    // Definir intervalo do dia
    // -----------------------
    const startDay = dayjs().startOf("day").toISOString();
    const endDay = dayjs().endOf("day").toISOString();

    // -----------------------
    // Buscar água ingerida
    // -----------------------
    const { data: waterRecords } = await supabase
      .from("water_records")
      .select("amount")
      .eq("user_id", userId)
      .gte("created_at", startDay)
      .lte("created_at", endDay);

    const totalWater = waterRecords?.reduce((sum, w) => sum + (w.amount ?? 0), 0) ?? 0;

    // -----------------------
    // Buscar refeições registradas
    // -----------------------
    const { data: mealRecords } = await supabase
      .from("meals")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", startDay)
      .lte("created_at", endDay);

    const mealsDone = mealRecords?.length ?? 0;
    const mealsPct = Math.min((mealsDone / metaRefeicoes) * 100, 100);

    // -----------------------
    // Buscar calorias ingeridas
    // -----------------------
    const { data: caloriesRecords } = await supabase
      .from("meals")
      .select("calories")
      .eq("user_id", userId)
      .gte("created_at", startDay)
      .lte("created_at", endDay);

    const totalCalories =
      caloriesRecords?.reduce((sum, m) => sum + (m.calories ?? 0), 0) ?? 0;

    return {
      water: Math.min((totalWater / metaAgua) * 100, 100),
      meals: mealsPct,
      calories: Math.min((totalCalories / metaCalorias) * 100, 100),
      caloriesValue: totalCalories,
      mealsDone,
      waterValue: totalWater
    };
  } catch (err) {
    console.error("Erro no loadDailyProgress:", err);
    return {
      water: 0,
      meals: 0,
      calories: 0,
      caloriesValue: 0,
      mealsDone: 0,
      waterValue: 0
    };
  }
}
