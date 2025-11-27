"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";

export default function WeightProgressChart({
  objetivo,
}: {
  objetivo: string;
}) {
  // Gera o gráfico baseado no objetivo
  const getData = () => {
    switch (objetivo) {
      case "Perder peso":
        return [
          { week: "Semana 1", value: 0 },
          { week: "Semana 2", value: -0.8 },
          { week: "Semana 3", value: -1.3 },
          { week: "Semana 4", value: -2.0 },
          { week: "Semana 5", value: -2.7 },
          { week: "Semana 6", value: -3.2 },
        ];

      case "Ganhar massa muscular":
        return [
          { week: "Semana 1", value: 0 },
          { week: "Semana 2", value: +0.4 },
          { week: "Semana 3", value: +0.9 },
          { week: "Semana 4", value: +1.4 },
          { week: "Semana 5", value: +1.8 },
          { week: "Semana 6", value: +2.2 },
        ];

      default:
        // manter peso
        return [
          { week: "Semana 1", value: 0 },
          { week: "Semana 2", value: 0.1 },
          { week: "Semana 3", value: -0.1 },
          { week: "Semana 4", value: 0 },
          { week: "Semana 5", value: 0.1 },
          { week: "Semana 6", value: 0 },
        ];
    }
  };

  const data = getData();

  return (
    <div className="w-full h-60 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12, fill: "#8A8A8A" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#8A8A8A" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00C974"
            strokeWidth={4}
            dot={{ r: 4, fill: "#00C974" }}
            activeDot={{ r: 6 }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
