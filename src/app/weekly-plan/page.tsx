"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import WeeklyPlanHeader from "@/components/weekly/WeeklyPlanHeader";
import WeeklyPlanList from "@/components/weekly/WeeklyPlanList";
import BottomBar from "@/components/home/BottomBar";
import loadWeeklyPlan from "@/services/home/loadWeeklyPlan";

export default function WeeklyPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [totals, setTotals] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      const weekly = await loadWeeklyPlan(data.user.id);
      setPlan(weekly.days);
      setTotals(weekly.totals);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !plan)
    return <div className="p-6 text-gray-500">Carregando plano...</div>;

  return (
    <div className="pb-24 pt-6 px-3">
      <WeeklyPlanHeader />
      <WeeklyPlanList plan={plan} totals={totals} />
      <BottomBar />
    </div>
  );
}
