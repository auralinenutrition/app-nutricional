"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Motivacional3Page() {
  const params = useSearchParams();
  const router = useRouter();

  const fromStep = Number(params.get("from") ?? 20);
  const nextStep = Number(params.get("next") ?? 21);

  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
  const saved = localStorage.getItem("quizData");
  if (saved) setQuizData(JSON.parse(saved));
}, []);

  if (!quizData) return null;

  const pesoAtual = Number(quizData.peso_atual);
  const pesoDesejado = Number(quizData.peso_desejado);

  const delta = pesoDesejado - pesoAtual;

  const semanas = [
    { label: "Semana 1", value: pesoAtual },
    { label: "Semana 2", value: pesoAtual + delta * 0.18 },
    { label: "Semana 3", value: pesoAtual + delta * 0.35 },
    { label: "Semana 4", value: pesoAtual + delta * 0.52 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="pt-6 pb-4 px-6">
        <Button
          onClick={() => router.push(`/quiz?step=${fromStep}`)}
          variant="ghost"
          className="p-2"
        >
          <ChevronLeft className="w-5 h-5 text-[#0A0A0A]" />
        </Button>

        <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
          <div className="h-full bg-[#00C974] rounded-full" style={{ width: "80%" }} />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="px-6 flex-1">
        <h1 className="text-[26px] font-bold text-[#0A0A0A] leading-snug">
          Sua evolução pode ser<br /> mais rápida do que imagina
        </h1>

        <div className="mt-6 bg-[#F8F8F8] p-5 rounded-2xl shadow-sm border border-[#ECECEC]">
          <h2 className="text-base font-semibold text-[#0A0A0A] mb-2">
            Progresso estimado nas primeiras semanas
          </h2>

          {/* Gráfico diferente (AreaChart) */}
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={semanas}>
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
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00C974"
                  fill="#00C97420"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[#6F6F6F] text-xs mt-3 leading-relaxed">
            Usuários com perfis semelhantes ao seu começam a ver mudanças visíveis
            entre 2 e 4 semanas — e você está iniciando exatamente no caminho
            certo para isso.
          </p>
        </div>

        <p className="mt-6 text-[#0A0A0A] text-sm leading-relaxed">
          Quanto antes você seguir seu plano, mais cedo seu corpo responde.  
          É impressionante o quanto pequenas decisões diárias aceleram sua transformação.
        </p>
      </div>

      {/* CTA mais emocional */}
      <div className="p-6">
        <Button
          onClick={() => router.push(`/quiz?step=${nextStep}`)}
          className="w-full h-12 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-base font-semibold"
        >
          Quero continuar evoluindo →
        </Button>
      </div>
    </div>
  );
}
