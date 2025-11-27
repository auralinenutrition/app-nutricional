import Link from "next/link";
import { ChevronRight } from "lucide-react";

const labels: Record<string, string> = {
  domingo: "Dom",
  segunda: "Seg",
  terca: "Ter",
  quarta: "Qua",
  quinta: "Qui",
  sexta: "Sex",
  sabado: "Sáb",
};

type Props = {
  dayKey: string;
  meals: any[];
  totalCalories: number;
  className?: string; // 👈 necessário para o auto-scroll
};

export default function WeeklyDayCard({
  dayKey,
  meals,
  totalCalories,
  className = "",
}: Props) {
  const todayIndex = new Date().getDay();
  const isToday =
    todayIndex ===
    ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"].indexOf(
      dayKey
    );

  return (
    <Link
      href={`/weekly-plan/${dayKey}`}
      className={`
        weekly-day-card
        p-4 rounded-xl shadow-sm border transition
        ${isToday ? "border-green-500/60 bg-green-50/50" : "border-gray-200 bg-white"}
        ${className}
      `}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold 
              ${isToday ? "bg-green-500" : "bg-gray-500"}
            `}
          >
            {labels[dayKey]}
          </div>

          <div>
            <p className="font-medium text-[#0A0A0A]">
              {isToday ? "Hoje" : labels[dayKey]}
            </p>
            <p className="text-sm text-gray-500">{totalCalories} kcal</p>
          </div>
        </div>

        <ChevronRight className="text-gray-500" />
      </div>

      <p className="text-gray-700 text-sm">
        {meals.map((m: any) => m.title).join(" • ")}
      </p>
    </Link>
  );
}
