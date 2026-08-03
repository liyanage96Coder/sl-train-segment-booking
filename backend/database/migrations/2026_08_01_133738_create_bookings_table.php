<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->restrictOnDelete();
            $table->foreignId('from_station_id')->constrained('stations')->restrictOnDelete();
            $table->foreignId('to_station_id')->constrained('stations')->restrictOnDelete();
            $table->string('passenger_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->boolean('email_verified')->default(false);
            $table->unsignedInteger('local_count');
            $table->unsignedInteger('foreign_count');
            $table->decimal('total_fare', 10, 2);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};