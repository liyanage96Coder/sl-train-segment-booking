<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainCoach extends Model
{
    use SoftDeletes;
    
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