// src/services/goals/saveUserTargets.ts
import { supabase } from "@/lib/supabase";
import { UserTargets } from "./calculateUserTargets";

export async function saveUserTargets(userId: string, targets: UserTargets) {
  const { error } = await supabase
    .from("users")
    .update({
      daily_calorie_goal: targets.daily_calorie_goal,
      daily_protein_goal: targets.daily_protein_goal,
      daily_water_goal: targets.daily_water_goal,
      daily_meals_goal: targets.daily_meals_goal,
      diet_type: targets.diet_type,
    })
    .eq("id", userId);

  if (error) {
    console.error("Erro ao salvar metas:", error);
    throw new Error(error.message);
  }

  return true;
}
