// src/app/weekly-plan/WeeklyPlanClient.tsx
"use client";

import { AiPlanDays } from "@/types/plan";

type Meal = {
  title: string;
  description?: string | null;
  calories?: number | null;
};

type WeeklyPlanClientProps = {
  plan: AiPlanDays | null | undefined;
  shoppingList?: string[];
  totals?: Record<string, number>;
};

export default function WeeklyPlanClient({ plan, shoppingList = [], totals = {} }: WeeklyPlanClientProps) {
  if (!plan) return <p>Nenhum plano gerado ainda.</p>;

  return (
    <div className="px-4 py-6 space-y-6">
      {Object.entries(plan).map(([day, meals]) => (
        <div key={day} className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold text-lg capitalize">{day}</h2>

          {meals.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">Nenhuma refeição definida</p>
          )}

          {meals.map((meal, index) => (
            <div key={index} className="mt-3 border-b pb-2">
              <p className="font-medium">{meal.title}</p>
              {meal.description ? <p className="text-sm text-gray-600">{meal.description}</p> : null}
              {meal.calories != null ? (
                <p className="text-xs text-gray-500 mt-1">{meal.calories} kcal</p>
              ) : null}
            </div>
          ))}
        </div>
      ))}

      {/* opcional: preview da shopping list */}
      {shoppingList.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold">Lista de compras</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
            {shoppingList.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
