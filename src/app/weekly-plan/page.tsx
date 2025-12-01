// src/app/weekly-plan/page.tsx
import loadHomeServer from "@/services/home/loadHomeServer";
import WeeklyPlanClient from "./WeeklyPlanClient";
import { getUserServer } from "@/lib/supabase/getUserServer";
import { redirect } from "next/navigation";import { AiDayMeal, AiPlanDays, DayKey } from "@/types/plan";
;

export default async function WeeklyPlanPage() {
  const { user } = await getUserServer();
  if (!user) redirect("/login");

  const data = await loadHomeServer(user.id);

  // ordered days so client shows consistent order
  const orderedDays: DayKey[] = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const convertPlan = (plan: any): AiPlanDays => {
    const converted: Partial<AiPlanDays> = {};
    for (const d of orderedDays) {
      const arr = (plan?.[d] ?? []) as any[];
      converted[d] = arr.map((m: any) => ({
        title: String(m.title ?? ""),
        description: m.description ?? "",
        calories: m.calories == null ? null : Number(m.calories),
      })) as AiDayMeal[];
    }
    return converted as AiPlanDays;
  };

  const validatedPlan = convertPlan(data?.plan ?? {});

  return <WeeklyPlanClient plan={validatedPlan} shoppingList={data?.shoppingList ?? []} totals={data?.totals ?? {}} />;
}
