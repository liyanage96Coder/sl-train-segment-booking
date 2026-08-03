<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('train_coach_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('seat_number');
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['train_coach_id', 'seat_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};