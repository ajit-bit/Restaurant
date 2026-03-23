export type Restaurant = {
  id: number;
  name: string;
  location: string;
  cuisine: string;
};

export type DailyOrdersPoint = {
  date: string; // YYYY-MM-DD
  count: number;
};

export type DailyRevenuePoint = {
  date: string; // YYYY-MM-DD
  revenue: number;
};

export type PeakHourPoint = {
  date: string; // YYYY-MM-DD
  hour: number | null; // 0-23 or null if no orders
  count: number;
};

export type RestaurantAnalyticsResponse = {
  daily_orders: DailyOrdersPoint[];
  daily_revenue: DailyRevenuePoint[];
  avg_order_value: number;
  peak_order_hour_per_day: PeakHourPoint[];
};

export type TopRestaurant = {
  restaurant_id: number;
  name: string | null;
  revenue: number;
};

export type TopRestaurantsResponse = {
  top_restaurants: TopRestaurant[];
};

export type AnalyticsFilters = {
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  start_hour?: number;
  end_hour?: number;
};

