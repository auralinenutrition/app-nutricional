"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>

          {/* Gradiente da linha */}
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00C974" stopOpacity={1} />
              <stop offset="100%" stopColor="#00E68A" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis dataKey="week" tick={{ fill: "#6F6F6F" }} />
          <YAxis hide />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#colorProgress)"
            strokeWidth={4}
            dot={false}
            animationDuration={1200}
            animationBegin={200}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
