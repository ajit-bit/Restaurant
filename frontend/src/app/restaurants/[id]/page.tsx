"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalyticsFilters, Restaurant, RestaurantAnalyticsResponse, TopRestaurant } from "@/lib/types";
import {
  fetchRestaurantAnalytics,
  fetchRestaurants,
  fetchTopRestaurants,
} from "@/lib/api";
import DateRangePicker from "@/components/DateRangePicker";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import TopRestaurantsTable from "@/components/TopRestaurantsTable";

const DEFAULT_START = "2025-06-22";
const DEFAULT_END = "2025-06-28";

function toNumberOrUndefined(v: string) {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function RestaurantAnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const restaurantId = Number(params.id);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => r.id === restaurantId),
    [restaurants, restaurantId]
  );

  const [startDate, setStartDate] = useState<string>(DEFAULT_START);
  const [endDate, setEndDate] = useState<string>(DEFAULT_END);

  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [startHour, setStartHour] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");

  const [analytics, setAnalytics] = useState<
    RestaurantAnalyticsResponse | null
  >(null);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const filters: AnalyticsFilters = {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        min_amount: toNumberOrUndefined(minAmount),
        max_amount: toNumberOrUndefined(maxAmount),
        start_hour: toNumberOrUndefined(startHour),
        end_hour: toNumberOrUndefined(endHour),
      };

      const [a, top] = await Promise.all([
        fetchRestaurantAnalytics(restaurantId, filters),
        fetchTopRestaurants(filters),
      ]);

      setAnalytics(a);
      setTopRestaurants(top.top_restaurants ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchRestaurants({
          sort_by: "name",
          sort_dir: "asc",
          limit: 50,
          offset: 0,
        });
        setRestaurants(list);
      } catch {
        // Dropdown still works best-effort.
      }

      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Trends for{" "}
                {selectedRestaurant?.name ?? `Restaurant #${restaurantId}`}
              </h1>
              <p className="text-sm text-zinc-600">
                Daily orders, revenue, average order value, and peak hour.
              </p>
            </div>

            <label className="flex flex-col gap-1 w-full sm:w-[260px]">
              <span className="text-sm">Restaurant</span>
              <select
                className="border border-black/10 rounded-sm px-3 py-2"
                value={restaurantId}
                onChange={(e) => {
                  const nextId = Number(e.target.value);
                  router.push(`/restaurants/${nextId}`);
                }}
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={({ startDate: s, endDate: e }) => {
              setStartDate(s);
              setEndDate(e);
            }}
          />

          <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
              <label className="flex flex-col gap-1 flex-1">
                <span className="text-sm">Min amount</span>
                <input
                  type="number"
                  step="0.01"
                  className="border border-black/10 rounded-sm px-3 py-2"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className="flex flex-col gap-1 flex-1">
                <span className="text-sm">Max amount</span>
                <input
                  type="number"
                  step="0.01"
                  className="border border-black/10 rounded-sm px-3 py-2"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className="flex flex-col gap-1 flex-1">
                <span className="text-sm">Start hour</span>
                <input
                  type="number"
                  className="border border-black/10 rounded-sm px-3 py-2"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  placeholder="0-23"
                />
              </label>

              <label className="flex flex-col gap-1 flex-1">
                <span className="text-sm">End hour</span>
                <input
                  type="number"
                  className="border border-black/10 rounded-sm px-3 py-2"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  placeholder="0-23"
                />
              </label>

              <div className="flex items-end">
                <button
                  className="bg-black text-white rounded-sm px-4 py-2 text-sm w-full md:w-auto"
                  onClick={load}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Apply Filters"}
                </button>
              </div>
            </div>
          </div>

          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        </div>

        {analytics ? <AnalyticsCharts analytics={analytics} /> : null}

        {topRestaurants.length > 0 ? (
          <TopRestaurantsTable topRestaurants={topRestaurants} />
        ) : null}
      </div>
    </div>
  );
}

