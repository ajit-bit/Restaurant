# Restaurant Order Trends Dashboard

Full-stack analytics dashboard for a restaurant platform.

## Tech Stack
- Backend: Laravel (PHP) using SQLite (mock data seeded from `backend/database/data/*.json`)
- Frontend: Next.js (React) + Tailwind CSS + Recharts

## Local Setup

### 1) Backend (Laravel)
```bash
cd backend
composer install
php artisan migrate:fresh --seed --force
php artisan serve --port 8000
```

Your API will be available at:
- `http://localhost:8000/api/restaurants`
- `http://localhost:8000/api/analytics/restaurant/{id}`
- `http://localhost:8000/api/analytics/top-restaurants`

### 2) Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend URL in `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Filter Parameters (Analytics)
Send these as query params to:
`/api/analytics/restaurant/{id}` and `/api/analytics/top-restaurants`

- `start_date` / `end_date` (optional): `YYYY-MM-DD`
- `min_amount` / `max_amount` (optional): numeric (e.g. `500.00`)
- `start_hour` / `end_hour` (optional): `0`-`23` (hour-of-day)

## Run
Keep both terminals running:
1. `php artisan serve --port 8000` (backend)
2. `npm run dev` (frontend)

Then open the Next.js URL (usually `http://localhost:3000`).

