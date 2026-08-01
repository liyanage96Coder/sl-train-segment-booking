<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStationRequest;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StationController extends Controller
{
    public function index()
    {
        return response()->json(
            Station::orderBy('station_order')->get()
        );
    }

    public function store(StoreStationRequest $request)
    {
        $station = Station::create([
            'station_name' => $request->station_name,
            'station_order' => $request->station_order,
            'station_code' => $this->generateStationCode(),
        ]);

        return response()->json([
            "message" => "Station added",
            "data" => $station
        ], 201);
    }

    public function insertBetween(Request $request)
    {
        $request->validate([
            'station_name' => 'required|string|max:255',
        ]);

        $station = DB::transaction(function () use ($request) {
            $newOrder = (Station::max('station_order') ?? 0) + 1;

            return Station::create([
                'station_name' => $request->station_name,
                'station_code' => $this->generateStationCode(),
                'station_order' => $newOrder,
            ]);
        });

        return response()->json([
            "message" => "Station added successfully",
            "data" => $station,
        ], 201);
    }

    public function update(Request $request, Station $station)
    {
        $request->validate([
            'station_name' => 'required|string|max:255',
        ]);

        // station_code is generated once at creation and intentionally
        // not editable here — only the name can change.
        $station->update([
            'station_name' => $request->station_name,
        ]);

        return response()->json([
            "message" => "Station updated",
            "data" => $station->fresh(),
        ]);
    }

    public function destroy(Station $station)
    {
        DB::transaction(function () use ($station) {
            $deletedOrder = $station->station_order;

            $station = Station::where('id', $station->id)
                ->lockForUpdate()
                ->firstOrFail();

            Station::where('station_order', '>', $deletedOrder)
                ->lockForUpdate()
                ->get();

            $station->delete();

            Station::where('station_order', '>', $deletedOrder)
                ->decrement('station_order');
        });

        return response()->json(["message" => "Station deleted"]);
    }

    private function generateStationCode(): string
    {
        do {
            $code = strtoupper(collect(range('A', 'Z'))->random(4)->implode(''));
        } while (Station::where('station_code', $code)->exists());

        return $code;
    }
}