<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('route_station', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_id')->constrained()->cascadeOnDelete();
            $table->foreignId('station_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('stop_order');
            $table->decimal('distance_km', 8, 2);
            $table->unsignedInteger('estimated_arrival_minutes');
            $table->softDeletes();
            $table->timestamps();

            // A station can only appear once per route, and a stop_order
            // position can only be used once per route.
            $table->unique(['route_id', 'station_id']);
            $table->unique(['route_id', 'stop_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_station');
    }
};