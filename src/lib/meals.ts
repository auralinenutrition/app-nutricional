// src/lib/meals.ts

export type MealType =
  | "breakfast"
  | "lunch"
  | "afternoon_snack"
  | "dinner"
  | "late_snack";

/** Inferir o tipo baseado no horário local do usuário */
export function inferMealType(date = new Date()): MealType {
  const h = date.getHours();
  const m = date.getMinutes();
  const t = h * 60 + m;

  const inRange = (start: number, end: number) => t >= start && t <= end;

  const toMin = (h: number, m = 0) => h * 60 + m;

  if (inRange(toMin(5), toMin(10, 59))) return "breakfast";
  if (inRange(toMin(11), toMin(15, 59))) return "lunch";
  if (inRange(toMin(16), toMin(18, 59))) return "afternoon_snack";
  if (inRange(toMin(19), toMin(23, 59))) return "dinner";
  return "late_snack"; // 00:00–04:59
}

/** Mapear tipo para título usado no loadTodayMeals */
export function mapTypeToTitle(type: MealType): string {
  switch (type) {
    case "breakfast":
      return "Café da manhã";
    case "lunch":
      return "Almoço";
    case "afternoon_snack":
      return "Café da tarde";
    case "dinner":
      return "Jantar";
    case "late_snack":
      return "Lanche da madrugada";
    default:
      return "Refeição";
  }
}
