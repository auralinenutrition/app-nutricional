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

export default function Motivacional2Page() {
  const params = useSearchParams();
  const router = useRouter();

  const fromStep = Number(params.get("from") ?? 11);
  const nextStep = Number(params.get("next") ?? 12);

  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
  const saved = localStorage.getItem("quizData");
  if (saved) setQuizData(JSON.parse(saved));
}, []);

  if (!quizData) return null;

  const pesoAtual = Number(quizData.peso_atual);
  const pesoDesejado = Number(quizData.peso_desejado);

  // projeção por 3 dias, 7 dias e 30 dias
  const variacaoTotal = pesoDesejado - pesoAtual;

  const data = [
    {
      label: "3 dias",
      value: pesoAtual + (variacaoTotal * 0.08),
    },
    {
      label: "7 dias",
      value: pesoAtual + (variacaoTotal * 0.18),
    },
    {
      label: "30 dias",
      value: pesoAtual + (variacaoTotal * 0.65),
    },
  ];

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

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
          <div
            className="h-full bg-[#00C974] rounded-full transition-all"
            style={{ width: "55%" }}
          />
        </div>
      </div>

      <div className="px-6 flex-1">
        <h1 className="text-[26px] font-bold text-[#0A0A0A] leading-snug mt-2">
          Você está mais perto da sua meta do que imagina
        </h1>

        {/* Card */}
        <div className="mt-6 bg-[#F8F8F8] p-5 rounded-2xl shadow-sm border border-[#ECECEC]">
          <h2 className="text-base font-semibold text-[#0A0A0A] mb-3">
            Evolução esperada do seu peso
          </h2>

          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="label"
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

          <p className="text-[#6F6F6F] text-xs mt-3 leading-relaxed">
            Com base nos dados reais de milhares de usuários, quem segue um plano
            personalizado costuma notar mudanças logo nos primeiros dias. Você já
            está progredindo.
          </p>
        </div>
      </div>

      {/* Button */}
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
