<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route as RouteModel;
use App\Models\Station;
use App\Models\Train;
use App\Models\Trip;
use App\Services\FareCalculatorService;
use App\Services\SegmentAvailabilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class TrainController extends Controller
{
    public function index()
    {
        return response()->json(
            Train::with(['route', 'coaches', 'stops'])->get()
        );
    }

    public function show(Train $train)
    {
        $train->load(['route', 'coaches.seats', 'stops']);

        $hasBookings = DB::table('booking_seats')
            ->join('trips', 'trips.id', '=', 'booking_seats.trip_id')
            ->where('trips.train_id', $train->id)
            ->exists();

        return response()->json(
            array_merge($train->toArray(), ['has_bookings' => $hasBookings])
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'train_name' => 'required|string|max:255',
            'route_id' => 'required|integer|exists:routes,id',
            'coaches' => 'required|array|min:1',
            'coaches.*.seat_count' => 'required|integer|min:1|max:200',
            'coaches.*.price_local_per_km' => 'required|numeric|min:0',
            'coaches.*.price_foreign_per_km' => 'required|numeric|min:0',
            'stop_station_ids' => 'required|array|min:2',
            'stop_station_ids.*' => 'required|integer|distinct|exists:stations,id',
        ]);

        $route = RouteModel::findOrFail($validated['route_id']);
        $routeStationIds = $route->stations()->pluck('stations.id')->all();

        $invalidStops = array_diff($validated['stop_station_ids'], $routeStationIds);
        if (!empty($invalidStops)) {
            abort(422, 'Selected stops must belong to the chosen route.');
        }

        $train = DB::transaction(function () use ($validated) {
            $train = Train::create([
                'train_name' => $validated['train_name'],
                'route_id' => $validated['route_id'],
            ]);

            foreach ($validated['coaches'] as $index => $coach) {
                $coachModel = $train->coaches()->create([
                    'coach_number' => $index + 1,
                    'seat_count' => $coach['seat_count'],
                    'price_local_per_km' => $coach['price_local_per_km'],
                    'price_foreign_per_km' => $coach['price_foreign_per_km'],
                ]);

                for ($seatNumber = 1; $seatNumber <= $coach['seat_count']; $seatNumber++) {
                    $coachModel->seats()->create(['seat_number' => $seatNumber]);
                }
            }

            $train->stops()->sync($validated['stop_station_ids']);

            return $train;
        });

        return response()->json([
            'message' => 'Train created',
            'data' => $train->load(['route', 'coaches.seats', 'stops']),
        ], 201);
    }

    public function update(Request $request, Train $train)
    {
        $validated = $request->validate([
            'train_name' => 'required|string|max:255',
            'stop_station_ids' => 'required|array|min:2',
            'stop_station_ids.*' => 'required|integer|distinct|exists:stations,id',
        ]);

        $routeStationIds = $train->route->stations()->pluck('stations.id')->all();
        $invalidStops = array_diff($validated['stop_station_ids'], $routeStationIds);
        if (!empty($invalidStops)) {
            abort(422, 'Selected stops must belong to this train\'s route.');
        }

        $train->update(['train_name' => $validated['train_name']]);
        $train->stops()->sync($validated['stop_station_ids']);

        return response()->json([
            'message' => 'Train updated',
            'data' => $train->load(['route', 'coaches.seats', 'stops']),
        ]);
    }

    public function destroy(Train $train)
    {
        $train->delete();
        return response()->json(['message' => 'Train deleted']);
    }

    public function forLeg(Request $request)
    {
        $validated = $request->validate([
            'route_id' => 'required|integer|exists:routes,id',
            'from_station_id' => 'required|integer|exists:stations,id',
            'to_station_id' => 'required|integer|exists:stations,id|different:from_station_id',
        ]);

        $trains = Train::with(['coaches', 'stops'])
            ->where('route_id', $validated['route_id'])
            ->whereHas('stops', fn ($q) => $q->where('stations.id', $validated['from_station_id']))
            ->whereHas('stops', fn ($q) => $q->where('stations.id', $validated['to_station_id']))
            ->get();

        return response()->json($trains);
    }

    public function seatMap(
        Request $request,
        Train $train,
        SegmentAvailabilityService $availability,
        FareCalculatorService $fareCalculator
    ) {
        $validated = $request->validate([
            'travel_date' => 'required|date',
            'from_station_id' => 'required|integer|exists:stations,id',
            'to_station_id' => 'required|integer|exists:stations,id|different:from_station_id',
        ]);

        $train->load(['route', 'coaches.seats']);

        $fromOrder = $availability->stopOrder($train->route_id, $validated['from_station_id']);
        $toOrder = $availability->stopOrder($train->route_id, $validated['to_station_id']);

        if ($fromOrder === null || $toOrder === null || $fromOrder >= $toOrder) {
            abort(422, "Invalid origin/destination for this train's route.");
        }

        $trip = Trip::firstOrCreate([
            'train_id' => $train->id,
            'travel_date' => $validated['travel_date'],
        ]);

        $fromStation = Station::findOrFail($validated['from_station_id']);
        $toStation = Station::findOrFail($validated['to_station_id']);

        $coaches = $train->coaches->map(function ($coach) use (
            $availability, $trip, $train, $fromOrder, $toOrder, $fromStation, $toStation, $fareCalculator
        ) {
            $seats = $coach->seats->map(function ($seat) use ($availability, $trip, $train, $fromOrder, $toOrder) {
                return [
                    'id' => $seat->id,
                    'seat_number' => $seat->seat_number,
                    'available' => $availability->isAvailable(
                        seatId: $seat->id,
                        tripId: $trip->id,
                        routeId: $train->route_id,
                        fromOrder: $fromOrder,
                        toOrder: $toOrder,
                        lock: false
                    ),
                ];
            });

            return [
                'id' => $coach->id,
                'coach_number' => $coach->coach_number,
                'fare_local' => $fareCalculator->calculate($coach, $train->route, $fromStation, $toStation, 'local'),
                'fare_foreign' => $fareCalculator->calculate($coach, $train->route, $fromStation, $toStation, 'foreign'),
                'seats' => $seats,
            ];
        });

        return response()->json([
            'trip_id' => $trip->id,
            'coaches' => $coaches,
        ]);
    }

    public function schedule(Request $request, Train $train)
    {
        $validated = $request->validate([
            'date' => 'required|date',
        ]);

        $train->load(['route.stations', 'coaches.seats']);

        $trip = Trip::where('train_id', $train->id)
            ->where('travel_date', $validated['date'])
            ->first();

        $routeStations = $train->route->stations;
        $stopOrderByStation = $routeStations->pluck('pivot.stop_order', 'id');

        $bookingsData = collect();

        if ($trip) {
            $bookingsData = DB::table('booking_seats')
                ->join('bookings', 'bookings.id', '=', 'booking_seats.booking_id')
                ->where('booking_seats.trip_id', $trip->id)
                ->select(
                    'booking_seats.id as booking_seat_id',
                    'booking_seats.seat_id',
                    'booking_seats.passenger_type',
                    'booking_seats.fare',
                    'bookings.id as booking_id',
                    'bookings.passenger_name',
                    'bookings.from_station_id',
                    'bookings.to_station_id'
                )
                ->get()
                ->map(function ($row) use ($stopOrderByStation, $routeStations) {
                    $fromStation = $routeStations->firstWhere('id', $row->from_station_id);
                    $toStation = $routeStations->firstWhere('id', $row->to_station_id);

                    return [
                        'booking_seat_id' => $row->booking_seat_id,
                        'booking_id' => $row->booking_id,
                        'seat_id' => $row->seat_id,
                        'passenger_type' => $row->passenger_type,
                        'passenger_name' => $row->passenger_name,
                        'fare' => $row->fare,
                        'from_stop_order' => $stopOrderByStation[$row->from_station_id] ?? null,
                        'to_stop_order' => $stopOrderByStation[$row->to_station_id] ?? null,
                        'from_station_name' => $fromStation->station_name ?? null,
                        'to_station_name' => $toStation->station_name ?? null,
                    ];
                });
        }

        return response()->json([
            'trip_id' => $trip?->id,
            'route_stations' => $routeStations->map(fn ($s) => [
                'id' => $s->id,
                'station_name' => $s->station_name,
                'stop_order' => $s->pivot->stop_order,
            ]),
            'coaches' => $train->coaches->map(fn ($c) => [
                'id' => $c->id,
                'coach_number' => $c->coach_number,
                'seats' => $c->seats->map(fn ($seat) => [
                    'id' => $seat->id,
                    'seat_number' => $seat->seat_number,
                ]),
            ]),
            'bookings' => $bookingsData->values(),
        ]);
    }

}