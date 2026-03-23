<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    protected $service;

    public function __construct(AnalyticsService $service)
    {
        $this->service = $service;
    }

    public function restaurantAnalytics($id, Request $request)
    {
        return response()->json(
            $this->service->restaurantAnalytics($id, $request->all())
        );
    }

    public function topRestaurants(Request $request)
    {
        return response()->json(
            $this->service->topRestaurants($request->all())
        );
    }
}