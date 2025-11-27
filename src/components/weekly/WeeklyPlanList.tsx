import { useEffect, useRef } from "react";
import WeeklyDayCard from "./WeeklyDayCard";
import { AiPlanDays } from "@/services/home/MealPlanMock";

type Props = {
  plan: AiPlanDays;
  totals: Record<string, number> | null;
};

export default function WeeklyPlanList({ plan, totals }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const daysOrder: (keyof AiPlanDays)[] = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const todayIndex = new Date().getDay(); // 0–6

  useEffect(() => {
    if (!containerRef.current) return;

    const allCards = containerRef.current.querySelectorAll(".weekly-day-card");
    const todayCard = allCards[todayIndex] as HTMLElement | undefined;

    if (todayCard) {
      todayCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {daysOrder.map((key) => (
        <WeeklyDayCard
          key={key}
          dayKey={key}
          meals={plan[key]}
          totalCalories={totals?.[key] ?? 0}
          className="weekly-day-card"
        />
      ))}
    </div>
  );
}
