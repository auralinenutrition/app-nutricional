"use client";

import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function WeightTransitionChart({
  pesoAtual,
  pesoDesejado,
}: {
  pesoAtual: number;
  pesoDesejado: number;
}) {
  const tendencia = pesoDesejado > pesoAtual ? "ganho" : "perda";

  const data = tendencia === "ganho"
    ? [
        { day: "3 Dias", value: pesoAtual },
        { day: "7 Dias", value: pesoAtual + 0.6 },
        { day: "30 Dias", value: pesoAtual + 1.5 },
      ]
    : [
        { day: "3 Dias", value: pesoAtual },
        { day: "7 Dias", value: pesoAtual - 0.8 },
        { day: "30 Dias", value: pesoAtual - 2.4 },
      ];

  return (
    <div className="w-full h-52">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#D17C3A"
            strokeWidth={4}
            dot={{ r: 5, fill: "#D17C3A" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
