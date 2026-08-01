<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{

    protected $fillable = [
        'station_name',
        'station_code',
        'station_order'
    ];


    protected $casts = [
        'station_order'=>'integer'
    ];

}