<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Train extends Model
{
    protected $fillable = ['train_name', 'route_id'];

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