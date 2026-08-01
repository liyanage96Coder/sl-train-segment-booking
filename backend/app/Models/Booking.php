<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'trip_id', 'from_station_id', 'to_station_id',
        'passenger_name', 'local_count', 'foreign_count', 'total_fare',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function fromStation()
    {
        return $this->belongsTo(Station::class, 'from_station_id');
    }

    public function toStation()
    {
        return $this->belongsTo(Station::class, 'to_station_id');
    }

    public function bookingSeats()
    {
        return $this->hasMany(BookingSeat::class);
    }
}