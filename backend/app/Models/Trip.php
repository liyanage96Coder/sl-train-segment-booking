<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = ['train_id', 'travel_date'];

    public function train()
    {
        return $this->belongsTo(Train::class);
    }
}