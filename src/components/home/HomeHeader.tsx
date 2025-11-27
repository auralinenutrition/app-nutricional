"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const DEFAULT_CALORIES = 1800;
const DEFAULT_WATER = 2500;
const DEFAULT_MEALS_PER_DAY = 4;

type UserProfile = {
  id: string;
  name?: string;
  daily_calorie_goal?: number | null;
  daily_water_goal?: number | null;
  sleep_goal?: number | null;
};

export default function HomeHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [waterSum, setWaterSum] = useState(0);
  const [mealsCount, setMealsCount] = useState(0);
  const [sleepHours, setSleepHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // 1) profile
        const { data: u } = await supabase
          .from("users")
          .select("id, name, daily_calorie_goal, daily_water_goal, sleep_goal")
          .eq("id", user.id)
          .single();
        setProfile(u ?? null);

        // Determine day bounds (local timezone)
        const startOfDay = dayjs().startOf("day").toDate();
        const endOfDay = dayjs().endOf("day").toDate();

        // 2) meals today
        const { data: meals } = await supabase
          .from("meals")
          .select("id, calories, eaten_at, consumed")
          .eq("user_id", user.id)
          .gte("eaten_at", startOfDay.toISOString())
          .lte("eaten_at", endOfDay.toISOString());
        const caloriesTotal = (meals || []).reduce(
          (s: number, m: any) => s + (Number(m.calories) || 0),
          0
        );
        const consumedCount = (meals || []).filter(
          (m: any) => m.consumed
        ).length;
        setCaloriesConsumed(caloriesTotal);
        setMealsCount(consumedCount);

        // 3) water today
        // If your water_records.date is a date (YYYY-MM-DD), compare strings instead
        const dayString = dayjs().format("YYYY-MM-DD");
        const { data: waters } = await supabase
          .from("water_records")
          .select("amount")
          .eq("user_id", user.id)
          .eq("date", dayString);
        const waterTotal = (waters || []).reduce(
          (s: number, w: any) => s + (Number(w.amount) || 0),
          0
        );
        setWaterSum(waterTotal);

        // 4) last sleep record
        const { data: sleep } = await supabase
          .from("sleep_records")
          .select("hours, date")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(1);
        if (sleep && sleep.length) setSleepHours(Number(sleep[0].hours));
      } catch (err) {
        console.error("Erro ao carregar header:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    // Optional: subscribe to realtime changes if you want live updates
    // return () => { unsubscribe if used }
  }, [user?.id]);

  const nomeCurto = profile?.name ? profile.name.split(" ")[0] : "amigo";
  const calorieGoal = profile?.daily_calorie_goal ?? DEFAULT_CALORIES;
  const waterGoal = profile?.daily_water_goal ?? DEFAULT_WATER;
  const mealGoal = DEFAULT_MEALS_PER_DAY;
  const sleepGoal = profile?.sleep_goal ?? 8;

  const caloriesRemaining = Math.max(0, calorieGoal - caloriesConsumed);
  const waterPercent = Math.min(100, Math.round((waterSum / waterGoal) * 100));
  const mealsPercent = Math.min(100, Math.round((mealsCount / mealGoal) * 100));
  const caloriesPercent = Math.min(
    100,
    Math.round((caloriesConsumed / calorieGoal) * 100)
  );
  const sleepDone = sleepHours ? sleepHours >= sleepGoal : false;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <header className="p-6 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">
            Bom dia, {nomeCurto} 👋
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-1">
            Mantenha o foco — pequenas vitórias importam.
          </p>
        </div>

        {/* Optionally show current weight / profile photo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer">
            👤
          </div>
        </div>
      </div>

      {/* METAS DIÁRIAS */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {/* Água */}
        <div className="bg-white rounded-xl p-3 flex flex-col items-center border">
          <div className="text-sm text-gray-500">💧 Água</div>
          <div className="text-lg font-semibold mt-1">{waterSum} ml</div>
          <div className="text-xs text-gray-400 mt-1">
            {waterPercent}% da meta
          </div>
        </div>

        {/* Refeições */}
        <div className="bg-white rounded-xl p-3 flex flex-col items-center border">
          <div className="text-sm text-gray-500">🍽 Refeições</div>
          <div className="text-lg font-semibold mt-1">
            {mealsCount}/{mealGoal}
          </div>
          <div className="text-xs text-gray-400 mt-1">{mealsPercent}%</div>
        </div>

        {/* Calorias */}
        <div className="bg-white rounded-xl p-3 flex flex-col items-center border">
          <div className="text-sm text-gray-500">🔥 Calorias</div>
          <div className="text-lg font-semibold mt-1">
            {caloriesConsumed} kcal
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {caloriesPercent}% da meta
          </div>
        </div>

        {/* Sono */}
        <div className="bg-white rounded-xl p-3 flex flex-col items-center border">
          <div className="text-sm text-gray-500">😴 Sono</div>
          <div className="text-lg font-semibold mt-1">
            {sleepHours ?? "—"} h
          </div>
          <div
            className={`text-xs mt-1 ${
              sleepDone ? "text-green-500" : "text-gray-400"
            }`}
          >
            {sleepDone ? "Meta atingida" : `Meta ${sleepGoal} h`}
          </div>
        </div>
      </div>
    </header>
  );
}
