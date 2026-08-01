<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    protected $fillable = ['route_name'];

    public function stations()
    {
        return $this->belongsToMany(Station::class, 'route_station')
            ->withPivot('stop_order','distance_km')
            ->orderByPivot('stop_order');
    }
}