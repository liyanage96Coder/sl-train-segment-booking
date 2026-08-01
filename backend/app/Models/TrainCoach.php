<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainCoach extends Model
{
    protected $fillable = [
        'train_id',
        'coach_number',
        'seat_count',
        'price_local_per_km',
        'price_foreign_per_km',
    ];

    public function train()
    {
        return $this->belongsTo(Train::class);
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }
}