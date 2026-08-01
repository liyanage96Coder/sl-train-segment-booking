<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::firstOrCreate(
            ['email' => 'kerneluser@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('KernelUser@123'),
            ]
        );

        $this->call([
            StationSeeder::class,
        ]);
    }
}