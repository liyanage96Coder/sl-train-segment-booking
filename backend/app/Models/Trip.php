<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trip extends Model
{
    use SoftDeletes;

    protected $fillable = ['train_id', 'travel_date'];

    public function train()
    {
        return $this->belongsTo(Train::class);
    }
}