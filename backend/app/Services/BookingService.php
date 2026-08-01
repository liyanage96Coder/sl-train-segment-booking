<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Seat;
use App\Models\Station;
use App\Models\Train;
use App\Models\Trip;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function __construct(
        private SegmentAvailabilityService $availability,
        private FareCalculatorService $fareCalculator
    ) {}

    public function createBooking(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $train = Train::with('route')->findOrFail($data['train_id']);
            $route = $train->route;

            $trip = Trip::firstOrCreate([
                'train_id' => $train->id,
                'travel_date' => $data['travel_date'],
            ]);

            $fromOrder = $this->availability->stopOrder($route->id, $data['from_station_id']);
            $toOrder = $this->availability->stopOrder($route->id, $data['to_station_id']);

            if ($fromOrder === null || $toOrder === null || $fromOrder >= $toOrder) {
                throw ValidationException::withMessages([
                    'stations' => 'Invalid origin/destination for this train\'s route.',
                ]);
            }

            $seatsRequested = collect($data['seats'])->sortBy('seat_id')->values();

            $bookingSeatsData = [];
            $totalFare = 0;
            $localCount = 0;
            $foreignCount = 0;

            $fromStation = Station::findOrFail($data['from_station_id']);
            $toStation = Station::findOrFail($data['to_station_id']);

            foreach ($seatsRequested as $seatRequest) {
                $seatId = $seatRequest['seat_id'];
                $passengerType = $seatRequest['passenger_type'];

                $isAvailable = $this->availability->isAvailable(
                    seatId: $seatId,
                    tripId: $trip->id,
                    routeId: $route->id,
                    fromOrder: $fromOrder,
                    toOrder: $toOrder,
                    lock: true
                );

                if (!$isAvailable) {
                    throw ValidationException::withMessages([
                        'seats' => "Seat #{$seatId} was just booked by someone else. Please refresh and try again.",
                    ]);
                }

                $seat = Seat::with('trainCoach')->findOrFail($seatId);

                $fare = $this->fareCalculator->calculate(
                    coach: $seat->trainCoach,
                    route: $route,
                    from: $fromStation,
                    to: $toStation,
                    passengerType: $passengerType
                );

                $totalFare += $fare;
                $passengerType === 'foreign' ? $foreignCount++ : $localCount++;

                $bookingSeatsData[] = [
                    'seat_id' => $seatId,
                    'trip_id' => $trip->id,
                    'passenger_type' => $passengerType,
                    'fare' => $fare,
                ];
            }

            $booking = Booking::create([
                'trip_id' => $trip->id,
                'from_station_id' => $data['from_station_id'],
                'to_station_id' => $data['to_station_id'],
                'passenger_name' => $data['passenger_name'] ?? null,
                'local_count' => $localCount,
                'foreign_count' => $foreignCount,
                'total_fare' => $totalFare,
            ]);

            foreach ($bookingSeatsData as $seatData) {
                $booking->bookingSeats()->create($seatData);
            }

            return $booking->load('bookingSeats.seat.trainCoach');
        });
    }
}