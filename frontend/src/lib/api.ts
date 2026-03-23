import type {
  AnalyticsFilters,
  Restaurant,
  RestaurantAnalyticsResponse,
  TopRestaurantsResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function toQuery(params: Record<string, string | number | undefined | null>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export async function fetchRestaurants(filters?: {
  search?: string;
  cuisine?: string;
  location?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<Restaurant[]> {
  const url = new URL("/api/restaurants", API_BASE_URL);
  if (filters) {
    url.search = toQuery({
      search: filters.search,
      cuisine: filters.cuisine,
      location: filters.location,
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
      limit: filters.limit,
      offset: filters.offset,
    });
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch restaurants: ${res.status}`);
  }
  return (await res.json()) as Restaurant[];
}

export async function fetchRestaurantAnalytics(
  restaurantId: number,
  filters?: AnalyticsFilters
): Promise<RestaurantAnalyticsResponse> {
  const url = new URL(
    `/api/analytics/restaurant/${restaurantId}`,
    API_BASE_URL
  );

  if (filters) {
    url.search = toQuery({
      start_date: filters.start_date,
      end_date: filters.end_date,
      min_amount: filters.min_amount,
      max_amount: filters.max_amount,
      start_hour: filters.start_hour,
      end_hour: filters.end_hour,
    });
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics: ${res.status}`);
  }
  return (await res.json()) as RestaurantAnalyticsResponse;
}

export async function fetchTopRestaurants(
  filters?: AnalyticsFilters
): Promise<TopRestaurantsResponse> {
  const url = new URL("/api/analytics/top-restaurants", API_BASE_URL);

  if (filters) {
    url.search = toQuery({
      start_date: filters.start_date,
      end_date: filters.end_date,
      min_amount: filters.min_amount,
      max_amount: filters.max_amount,
      start_hour: filters.start_hour,
      end_hour: filters.end_hour,
    });
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch top restaurants: ${res.status}`);
  }
  return (await res.json()) as TopRestaurantsResponse;
}

