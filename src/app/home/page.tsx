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
import { loadWeeklyPlanMock } from "@/services/home/MealPlanMock";

type Meal = {
  title: string;
  calories?: number;
  description?: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [shoppingItems, setShoppingItems] = useState<string[]>([]);
  const [calories, setCalories] = useState<number>(0);

  const [waterPct, setWaterPct] = useState<number>(0);
  const [mealsPct, setMealsPct] = useState<number>(0);

  const [weeklyPlan, setWeeklyPlan] = useState<AiPlanDays | null>(null);
  const [weeklyTotals, setWeeklyTotals] = useState<Record<
    string,
    number
  > | null>(null);

  // Buscar usuário logado
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  // Carregar metas diárias quando o usuário estiver disponível
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      // metas diárias
      const progress = await loadDailyProgress(user!.id);
      setWaterPct(progress.water);
      setMealsPct(progress.meals);
      setCalories(progress.caloriesValue);

      // refeições do dia
      const todayMeals = await loadTodayMeals(user!.id);
      setMeals(todayMeals);

      const weekly = await loadWeeklyPlan(user!.id);
      setWeeklyPlan(weekly.days);
      setWeeklyTotals(weekly.totals);
    }

    loadData();
  }, [user]);

  return (
    <div className="pb-24 pt-6 px-3">
      {/* HEADER */}
      <Header user={user} />

      {/* METAS DIÁRIAS */}
      <DailyGoals water={waterPct} meals={mealsPct} calories={calories} />

      {/* REFEIÇÕES DE HOJE */}
      <TodayMeals meals={meals} />

      {/* PLANO SEMANAL */}
      <WeeklyPlan plan={weeklyPlan ?? { domingo: [], segunda: [], terca: [], quarta: [], quinta: [], sexta: [], sabado: [] }} 
            totals={weeklyTotals ?? {}} />


      {/* LISTA + CALORIAS */}
      <div className="grid grid-cols-2 gap-4">
        <ShoppingPreview items={shoppingItems} />
        <CaloriesCard calories={calories} />
      </div>

      {/* AÇÕES */}
      <FloatingActionButton />

      {/* BOTTOM BAR */}
      <BottomBar />
    </div>
  );
}
