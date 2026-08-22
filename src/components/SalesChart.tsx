"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: { week: string; revenue: number; orders: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: "#6C757D" }}
          tickLine={false}
          axisLine={{ stroke: "#E9ECEF" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6C757D" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181B",
            borderColor: "#27272A",
            borderRadius: "10px",
            color: "#FFFFFF",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            fontSize: "12px",
            padding: "8px 14px",
          }}
          itemStyle={{ color: "#F6EFE3" }}
          formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#4F46E5"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#revenueGradient)"
          name="Revenue ($)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
