<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Seat extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['train_coach_id', 'seat_number'];

    public function trainCoach()
    {
        return $this->belongsTo(TrainCoach::class);
    }
}