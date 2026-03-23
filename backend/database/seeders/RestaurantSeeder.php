<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Restaurant;

class RestaurantSeeder extends Seeder
{
    public function run()
    {
        $data = json_decode(file_get_contents(database_path('data/restaurants.json')), true);

        foreach ($data as $item) {
            Restaurant::create($item);
        }
    }
}