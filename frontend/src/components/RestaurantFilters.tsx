"use client";

import type React from "react";

export type RestaurantFiltersValues = {
  search: string;
  cuisine: string;
  location: string;
  sort_by: "name" | "location" | "cuisine" | "id";
  sort_dir: "asc" | "desc";
};

export default function RestaurantFilters(props: {
  values: RestaurantFiltersValues;
  onChange: (next: RestaurantFiltersValues) => void;
  onApply: () => void;
}) {
  const { values, onChange, onApply } = props;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            🔍 Search Restaurant
          </span>
          <input
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            value={values.search}
            onChange={(e) => onChange({ ...values, search: e.target.value })}
            placeholder="e.g. Pizza Palace"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            🍽️ Cuisine Type
          </span>
          <input
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            value={values.cuisine}
            onChange={(e) => onChange({ ...values, cuisine: e.target.value })}
            placeholder="e.g. Italian, Chinese"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            📍 Location
          </span>
          <input
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            value={values.location}
            onChange={(e) =>
              onChange({ ...values, location: e.target.value })
            }
            placeholder="e.g. New York, Mumbai"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              📊 Sort By
            </span>
            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              value={values.sort_by}
              onChange={(e) =>
                onChange({
                  ...values,
                  sort_by: e.target.value as RestaurantFiltersValues["sort_by"],
                })
              }
            >
              <option value="name">Restaurant Name</option>
              <option value="location">Location</option>
              <option value="cuisine">Cuisine Type</option>
              <option value="id">Restaurant ID</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              ↕️ Sort Order
            </span>
            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              value={values.sort_dir}
              onChange={(e) =>
                onChange({
                  ...values,
                  sort_dir: e.target.value as RestaurantFiltersValues["sort_dir"],
                })
              }
            >
              <option value="asc">A to Z / Low to High</option>
              <option value="desc">Z to A / High to Low</option>
            </select>
          </label>
        </div>

        <button
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
          onClick={onApply}
        >
          🔎 Apply Filters
        </button>
      </div>
    </div>
  );
}

