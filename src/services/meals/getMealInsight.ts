export type MealInsight = {
  title: string;
  calories: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  portion_size?: string | null;
  description?: string | null;
  is_ai_suggested?: boolean;
  ai_version?: string;
};

export default async function getMealInsight(imageUrl: string, timeOfDay?: string) {
  const res = await fetch("/api/meal-insight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl, timeOfDay }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("AI error: " + text);
  }

  const json = await res.json();
  return json as MealInsight;
}
