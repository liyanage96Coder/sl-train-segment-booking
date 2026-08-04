<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Train extends Model
{
    use SoftDeletes;

    protected $fillable = ['train_name', 'route_id', 'departure_time'];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function coaches()
    {
        return $this->hasMany(TrainCoach::class)->orderBy('coach_number');
    }

    // Stations this train actually stops at — a subset of its route's stations.
    public function stops()
    {
        return $this->belongsToMany(Station::class, 'train_station');
    }
}