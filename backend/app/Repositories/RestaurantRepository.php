<?php

namespace App\Repositories;

use App\Models\Restaurant;

class RestaurantRepository
{
    public function getAll($filters = [])
    {
        $query = Restaurant::query();

        $search = $filters['search'] ?? null;
        if (!empty($search)) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $cuisine = $filters['cuisine'] ?? null;
        if (!empty($cuisine)) {
            $query->where('cuisine', 'like', '%' . $cuisine . '%');
        }

        $location = $filters['location'] ?? null;
        if (!empty($location)) {
            $query->where('location', 'like', '%' . $location . '%');
        }

        $sortBy = $filters['sort_by'] ?? 'name';
        $sortDir = strtolower($filters['sort_dir'] ?? 'asc');
        $sortDir = in_array($sortDir, ['asc', 'desc'], true) ? $sortDir : 'asc';

        $allowedSort = ['id', 'name', 'location', 'cuisine'];
        if (!in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'name';
        }

        $query->orderBy($sortBy, $sortDir);

        $limit = $filters['limit'] ?? null;
        $offset = $filters['offset'] ?? null;

        if (!empty($limit) && is_numeric($limit)) {
            $query->limit(min((int) $limit, 50));
        }

        if (!empty($offset) && is_numeric($offset)) {
            $query->offset(max(0, (int) $offset));
        }

        return $query->get(['id', 'name', 'location', 'cuisine']);
    }

    public function find($id)
    {
        return Restaurant::findOrFail($id);
    }
}