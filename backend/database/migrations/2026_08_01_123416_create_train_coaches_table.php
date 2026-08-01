<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('train_coaches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('train_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('coach_number');
            $table->unsignedInteger('seat_count');
            $table->decimal('price_local_per_km', 10, 2);
            $table->decimal('price_foreign_per_km', 10, 2);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['train_id', 'coach_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('train_coaches');
    }
};