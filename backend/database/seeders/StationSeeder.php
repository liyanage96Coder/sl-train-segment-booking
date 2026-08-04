<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Station;

class StationSeeder extends Seeder
{
    public function run(): void
    {
       Station::firstOrCreate(
        ['station_code' => 'CFO'],
        [
            'station_name' => 'Colombo Fort',
            'station_order' => 1,
        ]
    );
    }
}