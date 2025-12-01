import type { AiPlanDays, DayKey } from "./plan";

export type MealSummary = {
  title: string;
  calories?: number | null;
  description?: string | null;
};

export type HomeData = {
  metas: any;
  meals: MealSummary[];
  plan: AiPlanDays | null;
  shoppingList: string[];
  totals: Record<DayKey, number>;
  progress: {
    waterValue?: number;
    mealsDone?: number;
    caloriesValue?: number;
    water?: number;
    meals?: number;
    calories?: number;
  };
};
