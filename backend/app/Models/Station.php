<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{

    protected $fillable = [
        'station_name',
        'station_code',
        'station_order',
        'active',
    ];


    protected $casts = [
        'station_order'=>'integer'
    ];

    public function routes()
    {
        return $this->belongsToMany(Route::class, 'route_station')
            ->withPivot('stop_order');
    }

}