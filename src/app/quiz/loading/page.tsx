"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Analisando seus dados…",
  "Calculando suas metas ideais…",
  "Ajustando calorias e macros…",
  "Montando seu plano personalizado…",
];

export default function QuizLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  // Progresso suave
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.2; // suavidade
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  // Troca de textos
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  // Redireciona após ~4s
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/quiz-result");  
    }, 4000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">

      {/* Loading circular premium */}
      <div className="relative w-40 h-40 mb-10">
        <svg className="w-full h-full">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#EAEAEA"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#00C974"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * progress) / 100}
            className="transition-all duration-200"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-[#0A0A0A]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Texto animado */}
      <p className="text-lg text-[#0A0A0A] font-semibold text-center mb-4 transition-opacity duration-300">
        {STEPS[stepIndex]}
      </p>

      {/* Etapas em lista */}
      <div className="space-y-3 mt-4 w-full max-w-xs">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm"
          >
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                i <= stepIndex ? "bg-[#00C974] border-[#00C974]" : "border-gray-300"
              }`}
            />
            <span
              className={`${
                i <= stepIndex ? "text-[#00C974] font-medium" : "text-gray-400"
              }`}
            >
              {s.replace("…", "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
