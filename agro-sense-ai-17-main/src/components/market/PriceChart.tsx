import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint } from "@/types";

export function PriceChart({ data, height = 260 }: { data: PricePoint[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [
              `₹${value}/kg`,
              name === "price" ? "Actual" : "Predicted",
            ]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={false}
            connectNulls
            name="price"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="var(--secondary)"
            strokeWidth={2.5}
            strokeDasharray="6 5"
            dot={false}
            connectNulls
            name="predicted"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniPriceChart({ data }: { data: PricePoint[] }) {
  return (
    <div style={{ width: "100%", height: 90 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
          <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2} dot={false} connectNulls />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="var(--secondary)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
