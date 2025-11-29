import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

type DailyProgress = {
  water: number;        
  meals: number;        
  calories: number;     
  caloriesValue: number;
  mealsDone: number;    
  waterValue: number;   
};

export default async function loadDailyProgress(
  userId: string
): Promise<DailyProgress> {
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
    // Intervalo local do dia (CORRIGIDO)
    // -----------------------
    const startDay = dayjs().startOf("day").toDate().toISOString();
    const endDay = dayjs().endOf("day").toDate().toISOString();

    // -----------------------
    // Buscar água ingerida
    // -----------------------
    const { data: waterRecords } = await supabase
      .from("water_records")
      .select("amount")
      .eq("user_id", userId)
      .gte("created_at", startDay)
      .lte("created_at", endDay);

    const totalWater =
      waterRecords?.reduce((sum, w) => sum + (w.amount ?? 0), 0) ?? 0;

    // -----------------------
    // Buscar refeições registradas HOJE
    // -----------------------
    const { data: mealRecords } = await supabase
      .from("meals")
      .select("id, calories")
      .eq("user_id", userId)
      .gte("created_at", startDay)
      .lte("created_at", endDay);

    const mealsDone = mealRecords?.length ?? 0;
    const mealsPct = Math.min((mealsDone / metaRefeicoes) * 100, 100);

    // -----------------------
    // Calorias totais
    // -----------------------
    const totalCalories =
      mealRecords?.reduce((sum, m) => sum + (m.calories ?? 0), 0) ?? 0;

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
