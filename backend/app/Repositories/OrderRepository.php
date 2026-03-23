<?php

namespace App\Repositories;

use App\Models\Order;

class OrderRepository
{
    public function getFilteredOrders($restaurantId, $filters)
    {
        $query = Order::where('restaurant_id', $restaurantId);

        if (isset($filters['start_date'])) {
            $query->whereDate('order_time', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('order_time', '<=', $filters['end_date']);
        }

        return $query;
    }
}