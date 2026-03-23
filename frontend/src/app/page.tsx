/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RestaurantFilters, {
  type RestaurantFiltersValues,
} from "@/components/RestaurantFilters";
import type { Restaurant } from "@/lib/types";
import { fetchRestaurants } from "@/lib/api";

export default function Home() {
  const [values, setValues] = useState<RestaurantFiltersValues>({
    search: "",
    cuisine: "",
    location: "",
    sort_by: "name",
    sort_dir: "asc",
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRestaurants({
        search: values.search || undefined,
        cuisine: values.cuisine || undefined,
        location: values.location || undefined,
        sort_by: values.sort_by,
        sort_dir: values.sort_dir,
        limit: 50,
        offset: 0,
      });
      setRestaurants(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Restaurant Order Trends
          </h1>
          <p className="text-sm text-zinc-600">
            Browse restaurants and view daily order analytics.
          </p>
        </div>

        <RestaurantFilters
          values={values}
          onChange={setValues}
          onApply={load}
        />

        {loading ? (
          <div className="text-sm text-zinc-600">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-zinc-600">
                {restaurants.length} restaurant(s)
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[520px] w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-600">
                    <th className="py-2">Restaurant</th>
                    <th className="py-2">Cuisine</th>
                    <th className="py-2">Location</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-black/10"
                    >
                      <td className="py-3">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-zinc-500 text-xs">ID: {r.id}</div>
                      </td>
                      <td className="py-3">{r.cuisine}</td>
                      <td className="py-3">{r.location}</td>
                      <td className="py-3">
                        <Link
                          href={`/restaurants/${r.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-sm text-xs"
                        >
                          View Analytics
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {restaurants.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-zinc-600">
                        No restaurants found for these filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
