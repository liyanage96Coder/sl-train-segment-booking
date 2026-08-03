<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // firstOrCreate, not create — this seeder can safely run every
        // time the container boots (your compose command runs --seed on
        // every start) without throwing a duplicate-email error, the same
        // idempotency fix we applied to DatabaseSeeder's default user earlier.
        User::firstOrCreate(
            ['email' => 'admin@railway.lk'],
            [
                'name' => 'Admin',
                'password' => bcrypt('KernelUser@123'),
            ]
        );
    }
}