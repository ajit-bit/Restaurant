<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class AnalyticsService
{
    public function restaurantAnalytics($restaurantId, $filters)
    {
        $normalized = $this->normalizeFilters($filters);
        $cacheKey = $this->cacheKey('restaurantAnalytics', ['restaurantId' => $restaurantId] + $normalized);

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($restaurantId, $normalized) {
            $baseQuery = Order::query()->where('restaurant_id', $restaurantId);
            $this->applyFilters($baseQuery, $normalized);

            $dailyOrders = (clone $baseQuery)
                ->selectRaw("strftime('%Y-%m-%d', order_time) as date, COUNT(*) as count")
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $dailyRevenue = (clone $baseQuery)
                ->selectRaw("strftime('%Y-%m-%d', order_time) as date, SUM(order_amount) as revenue")
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $avgOrderValue = (clone $baseQuery)->avg('order_amount');

            // Aggregated counts by (day, hour). We then pick the peak hour per day in PHP,
            // which is still efficient because we never pull raw orders.
            $hourCounts = (clone $baseQuery)
                ->selectRaw("strftime('%Y-%m-%d', order_time) as date, CAST(strftime('%H', order_time) AS INTEGER) as hour, COUNT(*) as count")
                ->groupBy('date', 'hour')
                ->get();

            $ordersCountByDate = [];
            foreach ($dailyOrders as $row) {
                $ordersCountByDate[$row->date] = (int) $row->count;
            }

            $revenueByDate = [];
            foreach ($dailyRevenue as $row) {
                $revenueByDate[$row->date] = (float) $row->revenue;
            }

            $peakByDate = [];
            foreach ($hourCounts as $row) {
                $date = $row->date;
                $hour = (int) $row->hour;
                $count = (int) $row->count;

                if (!isset($peakByDate[$date])) {
                    $peakByDate[$date] = ['date' => $date, 'hour' => $hour, 'count' => $count];
                    continue;
                }

                $current = $peakByDate[$date];
                $isBetter = $count > $current['count']
                    || ($count === $current['count'] && $hour < $current['hour']); // tie-break: smaller hour

                if ($isBetter) {
                    $peakByDate[$date] = ['date' => $date, 'hour' => $hour, 'count' => $count];
                }
            }

            $dailyOrdersSeries = [];
            $dailyRevenueSeries = [];
            $peakSeries = [];

            if (!empty($normalized['start_date']) && !empty($normalized['end_date'])) {
                $start = Carbon::parse($normalized['start_date'])->startOfDay();
                $end = Carbon::parse($normalized['end_date'])->startOfDay();

                while ($start->lte($end)) {
                    $dateStr = $start->format('Y-m-d');

                    $dailyOrdersSeries[] = [
                        'date' => $dateStr,
                        'count' => $ordersCountByDate[$dateStr] ?? 0,
                    ];

                    $dailyRevenueSeries[] = [
                        'date' => $dateStr,
                        'revenue' => $revenueByDate[$dateStr] ?? 0.0,
                    ];

                    $peak = $peakByDate[$dateStr] ?? ['date' => $dateStr, 'hour' => null, 'count' => 0];
                    $peakSeries[] = $peak;

                    $start->addDay();
                }
            } else {
                $dailyOrdersSeries = $dailyOrders->map(fn ($r) => ['date' => $r->date, 'count' => (int) $r->count])->values()->all();
                $dailyRevenueSeries = $dailyRevenue->map(fn ($r) => ['date' => $r->date, 'revenue' => (float) $r->revenue])->values()->all();
                $peakSeries = array_values($peakByDate);
                usort($peakSeries, fn ($a, $b) => strcmp($a['date'], $b['date']));
            }

            return [
                'daily_orders' => $dailyOrdersSeries,
                'daily_revenue' => $dailyRevenueSeries,
                'avg_order_value' => $avgOrderValue !== null ? (float) $avgOrderValue : 0.0,
                'peak_order_hour_per_day' => $peakSeries,
            ];
        });
    }

    public function topRestaurants($filters)
    {
        $normalized = $this->normalizeFilters($filters);
        $cacheKey = $this->cacheKey('topRestaurants', $normalized);

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($normalized) {
            $baseQuery = Order::query();
            $this->applyFilters($baseQuery, $normalized);

            $rows = (clone $baseQuery)
                ->selectRaw('restaurant_id, SUM(order_amount) as revenue')
                ->groupBy('restaurant_id')
                ->orderByDesc('revenue')
                ->limit(3)
                ->get();

            $ids = $rows->pluck('restaurant_id')->filter()->values()->all();
            $restaurants = Restaurant::query()
                ->whereIn('id', $ids)
                ->get()
                ->keyBy('id');

            $topRestaurants = $rows->map(function ($row) use ($restaurants) {
                $restaurant = $restaurants->get((int) $row->restaurant_id);

                return [
                    'restaurant_id' => (int) $row->restaurant_id,
                    'name' => $restaurant?->name,
                    'revenue' => (float) $row->revenue,
                ];
            })->values()->all();

            return [
                'top_restaurants' => $topRestaurants,
            ];
        });
    }

    private function normalizeFilters(array $filters): array
    {
        $normalized = [
            'start_date' => $filters['start_date'] ?? null,
            'end_date' => $filters['end_date'] ?? null,
            'min_amount' => $filters['min_amount'] ?? null,
            'max_amount' => $filters['max_amount'] ?? null,
            'start_hour' => $filters['start_hour'] ?? null,
            'end_hour' => $filters['end_hour'] ?? null,
        ];

        // Trim empty values to keep caching stable and avoid invalid casts.
        foreach ($normalized as $key => $value) {
            if (is_string($value)) {
                $value = trim($value);
            }
            $normalized[$key] = $value === '' ? null : $value;
        }

        return $normalized;
    }

    private function applyFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['start_date'])) {
            $query->whereDate('order_time', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('order_time', '<=', $filters['end_date']);
        }

        if (!empty($filters['min_amount']) && is_numeric($filters['min_amount'])) {
            $query->where('order_amount', '>=', (float) $filters['min_amount']);
        }

        if (!empty($filters['max_amount']) && is_numeric($filters['max_amount'])) {
            $query->where('order_amount', '<=', (float) $filters['max_amount']);
        }

        $startHour = null;
        if (!empty($filters['start_hour']) && is_numeric($filters['start_hour'])) {
            $startHour = (int) $filters['start_hour'];
            $startHour = max(0, min(23, $startHour));
        }

        $endHour = null;
        if (!empty($filters['end_hour']) && is_numeric($filters['end_hour'])) {
            $endHour = (int) $filters['end_hour'];
            $endHour = max(0, min(23, $endHour));
        }

        // SQLite: extract hour with strftime('%H', order_time)
        if ($startHour !== null && $endHour !== null) {
            if ($startHour <= $endHour) {
                $query->whereRaw(
                    'CAST(strftime("%H", order_time) AS INTEGER) BETWEEN ? AND ?',
                    [$startHour, $endHour]
                );
            } else {
                // Wrap-around window, e.g. 22:00-02:00
                $query->whereRaw(
                    '(CAST(strftime("%H", order_time) AS INTEGER) >= ? OR CAST(strftime("%H", order_time) AS INTEGER) <= ?)',
                    [$startHour, $endHour]
                );
            }
        } elseif ($startHour !== null) {
            $query->whereRaw(
                'CAST(strftime("%H", order_time) AS INTEGER) >= ?',
                [$startHour]
            );
        } elseif ($endHour !== null) {
            $query->whereRaw(
                'CAST(strftime("%H", order_time) AS INTEGER) <= ?',
                [$endHour]
            );
        }
    }

    private function cacheKey(string $prefix, array $parts): string
    {
        return 'analytics:' . $prefix . ':' . md5(json_encode($parts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
}