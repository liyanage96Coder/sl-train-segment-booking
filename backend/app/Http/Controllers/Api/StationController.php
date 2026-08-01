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
        $station = Station::create(
            $request->validated()
        );

        return response()->json([
            "message" => "Station added",
            "data" => $station
        ], 201);
    }

    public function insertBetween(Request $request)
    {
        $request->validate([
            // nullable now — null means "insert as the very first station"
            'previous_station_id' => 'nullable|exists:stations,id',
            'station_name' => 'required|string|max:255',
            'station_code' => 'required|string|max:10|unique:stations,station_code',
        ]);

        $station = DB::transaction(function () use ($request) {
            if ($request->previous_station_id === null) {
                $newOrder = 1;
            } else {
                // Lock the reference row so a concurrent insert targeting
                // the same previous_station_id can't compute a stale order.
                $previousStation = Station::where('id', $request->previous_station_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $newOrder = $previousStation->station_order + 1;
            }

            // Lock every row we're about to shift before shifting it, so
            // two concurrent inserts into the same region serialize on
            // this transaction instead of racing and producing duplicate
            // station_order values.
            Station::where('station_order', '>=', $newOrder)
                ->lockForUpdate()
                ->get();

            Station::where('station_order', '>=', $newOrder)
                ->increment('station_order');

            return Station::create([
                'station_name' => $request->station_name,
                'station_code' => $request->station_code,
                'station_order' => $newOrder,
            ]);
        });

        return response()->json([
            "message" => "Station inserted successfully",
            "data" => $station,
        ], 201);
    }

    public function update(Request $request, Station $station)
    {
    $request->validate([
        'station_name' => 'required|string|max:255',
        'station_code' => [
            'required',
            'string',
            'max:10',
            'unique:stations,station_code,' . $station->id,
        ],
    ]);

    $station->update([
        'station_name' => $request->station_name,
        'station_code' => $request->station_code,
    ]);

    return response()->json([
        "message" => "Station updated",
        "data" => $station->fresh(),
    ]);
}
}