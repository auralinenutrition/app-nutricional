// ---------- DAY KEYS ----------
export type DayKey =
  | "domingo"
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

// ---------- MEAL TYPE ----------
export type AiDayMeal = {
  title: string;
  description: string; // sempre string normalizada
  calories: number;    // sempre number normalizado
};

// ---------- FULL WEEK PLAN ----------
export type AiPlanDays = Record<DayKey, AiDayMeal[]>;

// ---------- SHOPPING ----------
export type ShoppingList = string[];
