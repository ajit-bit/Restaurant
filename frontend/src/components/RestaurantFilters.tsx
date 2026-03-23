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
    <div className="flex flex-col gap-3 bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-sm">Search</span>
          <input
            className="border border-black/10 rounded-sm px-3 py-2"
            value={values.search}
            onChange={(e) => onChange({ ...values, search: e.target.value })}
            placeholder="Restaurant name"
          />
        </label>
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-sm">Cuisine</span>
          <input
            className="border border-black/10 rounded-sm px-3 py-2"
            value={values.cuisine}
            onChange={(e) => onChange({ ...values, cuisine: e.target.value })}
            placeholder="e.g. Italian"
          />
        </label>
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-sm">Location</span>
          <input
            className="border border-black/10 rounded-sm px-3 py-2"
            value={values.location}
            onChange={(e) =>
              onChange({ ...values, location: e.target.value })
            }
            placeholder="e.g. Delhi"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Sort By</span>
          <select
            className="border border-black/10 rounded-sm px-3 py-2"
            value={values.sort_by}
            onChange={(e) =>
              onChange({
                ...values,
                sort_by: e.target.value as RestaurantFiltersValues["sort_by"],
              })
            }
          >
            <option value="name">Name</option>
            <option value="location">Location</option>
            <option value="cuisine">Cuisine</option>
            <option value="id">ID</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Sort Direction</span>
          <select
            className="border border-black/10 rounded-sm px-3 py-2"
            value={values.sort_dir}
            onChange={(e) =>
              onChange({
                ...values,
                sort_dir: e.target.value as RestaurantFiltersValues["sort_dir"],
              })
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            className="bg-black text-white rounded-sm px-4 py-2 text-sm"
            onClick={onApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

