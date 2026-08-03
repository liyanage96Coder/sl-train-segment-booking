<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingSeat extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['booking_id', 'seat_id', 'trip_id', 'passenger_type', 'fare'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }
}