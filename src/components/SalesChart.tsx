"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesChart({
  data,
}: {
  data: { week: string; revenue: number; orders: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,36,32,0.1)" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#FF7A54" strokeWidth={2} name="Revenue ($)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
