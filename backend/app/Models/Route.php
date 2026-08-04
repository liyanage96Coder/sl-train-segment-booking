<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Route extends Model
{
    use SoftDeletes;

    protected $fillable = ['route_name'];

    public function stations()
    {
        return $this->belongsToMany(Station::class, 'route_station')
            ->withPivot('stop_order','distance_km', 'estimated_arrival_minutes')
            ->orderByPivot('stop_order');
    }
}