<?php

namespace App\Services;

use App\Models\Route;
use App\Models\Station;
use App\Models\TrainCoach;

class FareCalculatorService
{
    public function calculate(
        TrainCoach $coach,
        Route $route,
        Station $from,
        Station $to,
        string $passengerType
    ): float {
        $fromPivot = $route->stations()->where('stations.id', $from->id)->firstOrFail()->pivot;
        $toPivot = $route->stations()->where('stations.id', $to->id)->firstOrFail()->pivot;

        $distanceKm = abs($toPivot->distance_km - $fromPivot->distance_km);

        $ratePerKm = $passengerType === 'foreign'
            ? $coach->price_foreign_per_km
            : $coach->price_local_per_km;

        return round($ratePerKm * $distanceKm, 2);
    }
}