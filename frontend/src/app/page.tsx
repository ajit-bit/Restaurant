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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              🍽️ Restaurant Analytics Dashboard
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Discover insights, track trends, and optimize performance for restaurants worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Restaurants</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{restaurants.length}</p>
              </div>
              <div className="text-4xl">🏪</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cuisines Available</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {[...new Set(restaurants.map(r => r.cuisine))].length}
                </p>
              </div>
              <div className="text-4xl">🍜</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Locations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {[...new Set(restaurants.map(r => r.location))].length}
                </p>
              </div>
              <div className="text-4xl">📍</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🔍 Search & Filter Restaurants
          </h2>
          <RestaurantFilters
            values={values}
            onChange={setValues}
            onApply={load}
          />
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  📊 Restaurant Directory
                </h2>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {restaurants.length} restaurants found
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cuisine
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {restaurants.map((r, index) => (
                    <tr 
                      key={r.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {r.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {r.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {r.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                          {r.cuisine}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        📍 {r.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/restaurants/${r.id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 font-medium"
                        >
                          📈 View Analytics
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {restaurants.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-lg font-medium">No restaurants found</p>
                        <p className="text-sm mt-2">Try adjusting your filters or search criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
