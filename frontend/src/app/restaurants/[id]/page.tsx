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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📊</span>
                <h1 className="text-4xl font-bold tracking-tight">
                  Analytics for {selectedRestaurant?.name ?? `Restaurant #${restaurantId}`}
                </h1>
              </div>
              <p className="text-red-100 text-lg">
                Daily orders, revenue trends, average order value, and peak hours analysis
              </p>
            </div>

            <label className="flex flex-col gap-2 w-full lg:w-[300px]">
              <span className="text-sm font-medium text-red-100">🏪 Switch Restaurant</span>
              <select
                className="px-4 py-3 rounded-lg border-0 text-gray-900 focus:ring-2 focus:ring-red-300 font-medium"
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            🎛️ Analytics Filters
          </h2>
          
          <div className="space-y-6">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={({ startDate: s, endDate: e }) => {
                setStartDate(s);
                setEndDate(e);
              }}
            />

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                💰 Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Min Amount ($)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Max Amount ($)
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="999.99"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Start Hour
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    placeholder="0-23"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    End Hour
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    placeholder="0-23"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={load}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading Analytics...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      📈 Apply Filters
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Analytics Content */}
        <div className="space-y-8">
          {analytics ? (
            <div className="animate-in fade-in duration-500">
              <AnalyticsCharts analytics={analytics} />
            </div>
          ) : !loading && !error ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Analytics Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Apply filters above to load restaurant analytics data
              </p>
            </div>
          ) : null}

          {topRestaurants.length > 0 ? (
            <div className="animate-in fade-in duration-700 delay-150">
              <TopRestaurantsTable topRestaurants={topRestaurants} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

