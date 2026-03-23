"use client";

import type { TopRestaurant } from "@/lib/types";

export default function TopRestaurantsTable(props: {
  topRestaurants: TopRestaurant[];
}) {
  const { topRestaurants } = props;

  return (
    <div className="bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Top 3 by Revenue</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[420px] w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-600">
              <th className="py-2">Restaurant</th>
              <th className="py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topRestaurants.length === 0 ? (
              <tr>
                <td className="py-3" colSpan={2}>
                  No data for this range.
                </td>
              </tr>
            ) : (
              topRestaurants.map((r) => (
                <tr key={r.restaurant_id} className="border-t border-black/10">
                  <td className="py-3">
                    <div className="font-medium">{r.name ?? `#${r.restaurant_id}`}</div>
                    <div className="text-zinc-500 text-xs">
                      ID: {r.restaurant_id}
                    </div>
                  </td>
                  <td className="py-3 font-medium">
                    ${r.revenue.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

