<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route as RouteModel;
use App\Models\Train;
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
                $train->coaches()->create([
                    'coach_number' => $index + 1,
                    'seat_count' => $coach['seat_count'],
                    'price_local_per_km' => $coach['price_local_per_km'],
                    'price_foreign_per_km' => $coach['price_foreign_per_km'],
                ]);
            }

            $train->stops()->sync($validated['stop_station_ids']);

            return $train;
        });

        return response()->json([
            'message' => 'Train created',
            'data' => $train->load(['route', 'coaches', 'stops']),
        ], 201);
    }

    public function destroy(Train $train)
    {
        $train->delete();

        return response()->json(['message' => 'Train deleted']);
    }
}