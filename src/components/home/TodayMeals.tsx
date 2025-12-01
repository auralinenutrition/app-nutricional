// src/components/home/TodayMeals.tsx
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Meal = {
  title: string;
  calories?: number;
  description?: string;
};

type TodayMealsProps = {
  meals: Meal[];
};

export default function TodayMeals({ meals }: TodayMealsProps) {
  const router = useRouter();
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="px-2 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">Refeições de hoje</h2>
        <span className="text-sm text-gray-500">{today}</span>
      </div>

      {meals?.length === 0 && (
        <p className="text-gray-500">
          Nenhuma refeição encontrada para hoje — a IA ainda não gerou um plano.
        </p>
      )}

      {meals?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 relative">
          <div
            className="absolute right-4 top-4 cursor-pointer text-gray-400"
            onClick={() => router.push("/meals")}
          >
            <ChevronRight size={22} />
          </div>

          {meals.map((meal, i) => (
            <div key={i} className="mb-4">
              <p className="font-medium">{meal.title}</p>
              {meal.calories !== undefined && (
                <p className="text-sm text-gray-500">{meal.calories} kcal</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
