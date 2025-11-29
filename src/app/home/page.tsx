"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

import Header from "@/components/home/Header";
import DailyGoals from "@/components/home/DailyGoals";
import TodayMeals from "@/components/home/TodayMeals";
import WeeklyPlan, { AiPlanDays } from "@/components/home/WeeklyPlan";
import ShoppingPreview from "@/components/home/ShoppingPreview";
import CaloriesCard from "@/components/home/CaloriesCard";
import BottomBar from "@/components/home/BottomBar";
import FloatingActionButton from "@/components/home/FloatingActionButton";

import loadDailyProgress from "@/services/home/loadDailyProgress";
import loadTodayMeals from "@/services/home/loadTodayMeals";
import loadWeeklyPlan from "@/services/home/loadWeeklyPlan";

// -------------------------
// TYPES
// -------------------------
type Meal = {
  title: string;
  calories?: number;
  description?: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  const [progress, setProgress] = useState<any>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [shoppingItems, setShoppingItems] = useState<string[]>([]);
  const [calories, setCalories] = useState<number>(0);

  const [weeklyPlan, setWeeklyPlan] = useState<AiPlanDays | null>(null);
  const [weeklyTotals, setWeeklyTotals] = useState<Record<string, number> | null>(
    null
  );

  // -----------------------------
  // LOAD USER
  // -----------------------------
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  // -----------------------------
  // RELOAD HOME DATA
  // -----------------------------
  async function reloadHomeData(uid: string) {
    const p = await loadDailyProgress(uid);
    setProgress(p);
    setCalories(p.caloriesValue);

    const todayMeals = await loadTodayMeals(uid);
    setMeals(todayMeals);

    const weekly = await loadWeeklyPlan(uid);
    setWeeklyPlan(weekly.days);
    setWeeklyTotals(weekly.totals);
  }

  // Carrega ao iniciar
  useEffect(() => {
    if (!user) return;
    reloadHomeData(user.id);
  }, [user]);

  // Recarrega ao salvar água
  useEffect(() => {
    if (!user) return;

    const handler = () => reloadHomeData(user.id);

    window.addEventListener("waterSaved", handler);
    return () => window.removeEventListener("waterSaved", handler);
  }, [user]);

  // Recarrega ao salvar refeição
  useEffect(() => {
    if (!user) return;

    const handler = () => reloadHomeData(user.id);

    window.addEventListener("mealSaved", handler);
    return () => window.removeEventListener("mealSaved", handler);
  }, [user]);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (!progress) return null;

  // -----------------------------
  // RENDER COMPONENT
  // -----------------------------
  return (
    <div className="pb-24 pt-6 px-3">
      <Header user={user} />

      <DailyGoals
        water={progress.water}
        meals={progress.meals}
        calories={progress.calories}
        waterValue={progress.waterValue}
        waterGoal={progress.metaAgua ?? 2000}
        mealsDone={progress.mealsDone}
        mealsGoal={progress.metaRefeicoes ?? 4}
        caloriesValue={progress.caloriesValue}
        caloriesGoal={progress.metaCalorias ?? 2000}
      />

      <TodayMeals meals={meals} />

      <WeeklyPlan
        plan={
          weeklyPlan ?? {
            domingo: [],
            segunda: [],
            terca: [],
            quarta: [],
            quinta: [],
            sexta: [],
            sabado: [],
          }
        }
        totals={weeklyTotals ?? {}}
      />

      <div className="grid grid-cols-2 gap-4">
        <ShoppingPreview items={shoppingItems} />
        <CaloriesCard calories={calories} />
      </div>

      <FloatingActionButton />
      <BottomBar />
    </div>
  );
}
