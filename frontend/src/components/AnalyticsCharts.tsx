"use client";

import type { RestaurantAnalyticsResponse } from "@/lib/types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsCharts(props: {
  analytics: RestaurantAnalyticsResponse;
}) {
  const { analytics } = props;

  const ordersData = analytics.daily_orders.map((p) => ({
    date: p.date,
    count: p.count,
  }));

  const revenueData = analytics.daily_revenue.map((p) => ({
    date: p.date,
    revenue: p.revenue,
  }));

  const peakData = analytics.peak_order_hour_per_day.map((p) => ({
    date: p.date,
    hour: p.hour ?? 0,
    count: p.count,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
        <div className="text-sm text-zinc-600">Average Order Value</div>
        <div className="text-2xl font-semibold">
          ${analytics.avg_order_value.toFixed(2)}
        </div>
      </div>

      <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
        <div className="text-lg font-semibold mb-2">
          Daily Orders Count
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
        <div className="text-lg font-semibold mb-2">
          Daily Revenue
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number" ? value.toFixed(2) : value
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
        <div className="text-lg font-semibold mb-2">
          Peak Order Hour per Day
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={peakData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 23]} ticks={[0, 6, 12, 18, 23]} />
              <Tooltip
                formatter={(value: any, name: any, props: any) => {
                  if (name === "hour") return [`${value}:00`, "Peak hour"];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="hour"
                stroke="#f59e0b"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

