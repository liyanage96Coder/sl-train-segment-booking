<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class SegmentAvailabilityService
{
    public function stopOrder(int $routeId, int $stationId): ?int
    {
        return DB::table('route_station')
            ->where('route_id', $routeId)
            ->where('station_id', $stationId)
            ->value('stop_order');
    }

    public function isAvailable(
        int $seatId,
        int $tripId,
        int $routeId,
        int $fromOrder,
        int $toOrder,
        bool $lock = false
    ): bool {
        $query = DB::table('booking_seats')
            ->join('bookings', 'bookings.id', '=', 'booking_seats.booking_id')
            ->where('booking_seats.seat_id', $seatId)
            ->where('booking_seats.trip_id', $tripId);

        if ($lock) {
            $query->lockForUpdate();
        }

        $existingSegments = $query->get(['bookings.from_station_id', 'bookings.to_station_id']);

        foreach ($existingSegments as $segment) {
            $existingFrom = $this->stopOrder($routeId, $segment->from_station_id);
            $existingTo = $this->stopOrder($routeId, $segment->to_station_id);

            if ($existingFrom < $toOrder && $fromOrder < $existingTo) {
                return false;
            }
        }

        return true;
    }
}