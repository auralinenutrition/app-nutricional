import { motion } from "framer-motion";

type CircularProgressProps = {
  value: number; // percentual 0–100
  innerText?: string; // texto grande dentro
  innerSub?: string; // texto pequeno abaixo do texto principal
};

export default function CircularProgress({
  value,
  innerText,
  innerSub,
}: CircularProgressProps) {
  const radius = 36;
  const stroke = 12; // mais grosso
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-[90px] h-[90px] flex items-center justify-center">
      {/* SVG do círculo */}
      <svg className="w-[90px] h-[90px] transform -rotate-90">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00C974" />
            <stop offset="100%" stopColor="#0AD18C" />
          </linearGradient>
        </defs>
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progresso */}
        <motion.circle
          cx="45"
          cy="45"
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
        />
      </svg>

      {/* Conteúdo central */}
      <div className="absolute flex flex-col items-center">
        {innerText && (
          <span className="text-sm font-semibold text-[#0A0A0A] leading-tight">
            {innerText}
          </span>
        )}
        {innerSub && (
          <span className="text-[10px] text-gray-500 mt-[1px]">{innerSub}</span>
        )}
      </div>
    </div>
  );
}
