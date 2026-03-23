<?php

use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AnalyticsController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

Route::get('/analytics/restaurant/{id}', [AnalyticsController::class, 'restaurantAnalytics']);
Route::get('/analytics/top-restaurants', [AnalyticsController::class, 'topRestaurants']);