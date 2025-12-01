"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";

export default function Motivacional1Page() {
  const params = useSearchParams();
  const router = useRouter();

  const fromStep = Number(params.get("from") ?? 7);
  const nextStep = Number(params.get("next") ?? 8);

  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quizData");
    if (saved) setQuizData(JSON.parse(saved));
  }, []);

  if (!quizData) return null;

  const pesoAtual = Number(quizData.peso_atual);
  const pesoDesejado = Number(quizData.peso_desejado);

  const diferenca = pesoDesejado - pesoAtual;
  const variacaoSemanal = diferenca / 6;

  const data = Array.from({ length: 6 }).map((_, i) => ({
    week: `Semana ${i + 1}`,
    value: pesoAtual + variacaoSemanal * (i + 1),
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="pt-6 pb-4 px-6">
        <Button
          onClick={() => router.push(`/quiz?step=${fromStep}`)}
          variant="ghost"
          className="p-2"
        >
          <ChevronLeft className="w-5 h-5 text-[#0A0A0A]" />
        </Button>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
          <div
            className="h-full bg-[#00C974] rounded-full transition-all"
            style={{ width: "38%" }}
          />
        </div>
      </div>

      <div className="px-6 flex-1">
        <h1 className="text-[26px] font-bold text-[#0A0A0A] leading-snug mt-2">
          Você tem grande potencial para alcançar sua meta
        </h1>

        {/* Card */}
        <div className="mt-6 bg-[#F8F8F8] p-5 rounded-2xl shadow-sm border border-[#ECECEC]">
          <h2 className="text-base font-semibold text-[#0A0A0A] mb-3">
            Transição do seu peso
          </h2>

          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#6F6F6F", fontSize: 11 }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6F6F6F", fontSize: 11 }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00C974"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#00C974" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[#6F6F6F] text-xs mt-3">
            Projeção feita com base no seu peso atual{" "}
            <span className="font-semibold text-black">{pesoAtual}kg</span> e peso
            desejado{" "}
            <span className="font-semibold text-black">{pesoDesejado}kg</span>.
          </p>
        </div>
      </div>

      <div className="p-6">
        <Button
          onClick={() => router.push(`/quiz?step=${nextStep}`)}
          className="w-full h-12 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
