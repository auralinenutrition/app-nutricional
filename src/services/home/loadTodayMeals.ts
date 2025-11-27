import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { loadWeeklyPlanMock } from "./MealPlanMock";
import type { AiPlanDays, AiDayMeal } from "./MealPlanMock";

export type TodayMeal = {
  title: string;
  description?: string;
  calories?: number;
  done: boolean;
};

export default async function loadTodayMeals(
  userId: string
): Promise<TodayMeal[]> {
  try {
    // -------------------------------
    // 1 • Obter chave do dia atual
    // -------------------------------
    const dayMap: Record<number, keyof AiPlanDays> = {
      0: "domingo",
      1: "segunda",
      2: "terca",
      3: "quarta",
      4: "quinta",
      5: "sexta",
      6: "sabado",
    };

    const todayKey: keyof AiPlanDays = dayMap[dayjs().day()];

    // -------------------------------
    // 2 • Buscar plano real da IA
    // -------------------------------
    const { data: plan } = await supabase
      .from("ai_generated_meal_plan")
      .select("days")
      .eq("user_id", userId)
      .order("week_start", { ascending: false })
      .limit(1)
      .single();

    let todayMealsFromAI: AiDayMeal[] = [];

    if (plan?.days && plan.days[todayKey]) {
      todayMealsFromAI = plan.days[todayKey];
    } else {
      // -------------------------------
      // 2B • Mock (fallback)
      // -------------------------------
      const mock = await loadWeeklyPlanMock();
      todayMealsFromAI = mock[todayKey] ?? [];
    }

    // -------------------------------
    // 3 • Buscar refeições registradas HOJE
    // -------------------------------
    const start = dayjs().startOf("day").toISOString();
    const end = dayjs().endOf("day").toISOString();

    const { data: userMeals } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", start)
      .lte("created_at", end);

    const mealsByTitle = (userMeals ?? []).reduce((map, meal) => {
      map[meal.title] = meal;
      return map;
    }, {} as Record<string, any>);

    // -------------------------------
    // 4 • Montar resposta final
    // -------------------------------
    const order = ["Café da manhã", "Almoço", "Café da tarde", "Jantar"];

    return order.map((ref) => {
      const userMeal = mealsByTitle[ref];
      const aiMeal = todayMealsFromAI.find((m) => m.title === ref);

      if (userMeal) {
        return {
          title: ref,
          description: userMeal.description ?? aiMeal?.description,
          calories: userMeal.calories ?? aiMeal?.calories,
          done: true,
        };
      }

      return {
        title: ref,
        description: aiMeal?.description ?? "",
        calories: aiMeal?.calories ?? 0,
        done: false,
      };
    });
  } catch (err) {
    console.error("Erro em loadTodayMeals:", err);
    return [];
  }
}
