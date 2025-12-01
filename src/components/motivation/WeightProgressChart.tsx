"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";

type ChartProps = {
  pesoAtual: number;
  pesoDesejado: number;
};

/**
 * Gera projeção linear de peso para 6 semanas.
 * Exemplo:
 * - Atual: 70
 * - Desejado: 80
 * => Sobe 10kg em 6 semanas → +1.66kg/semana
 */
function gerarProjecaoSemanal(pesoAtual: number, pesoDesejado: number) {
  const semanas = 6;
  const diffTotal = pesoDesejado - pesoAtual;
  const passo = diffTotal / semanas;

  const arr = [];

  for (let i = 0; i <= semanas; i++) {
    const peso = Number((pesoAtual + passo * i).toFixed(1));
    arr.push({
      week: `Semana ${i + 1}`,
      peso,
    });
  }

  return arr;
}

export default function WeightProgressChart({
  pesoAtual,
  pesoDesejado,
}: ChartProps) {
  const data = gerarProjecaoSemanal(pesoAtual, pesoDesejado);

  // define range do eixo Y com base nos valores
  const values = data.map((d) => d.peso);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;

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
            domain={[min, max]}
            tick={{ fontSize: 12, fill: "#8A8A8A" }}
            tickLine={false}
            axisLine={false}
            width={35}
          />
          <Tooltip
            formatter={(value) => [`${value} kg`, "Peso"]}
            contentStyle={{
              borderRadius: 10,
              border: "none",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="peso"
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
