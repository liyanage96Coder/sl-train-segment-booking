<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    protected $fillable = ['train_coach_id', 'seat_number'];

    public function trainCoach()
    {
        return $this->belongsTo(TrainCoach::class);
    }
}