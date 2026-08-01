<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RouteController extends Controller
{
    public function index()
    {
        $routes = Route::with('stations')->get();

        return response()->json($routes);
    }

    public function show(Route $route)
    {
        return response()->json($route->load('stations'));
    }

    public function store(Request $request)
    {
        $validated = $this->validateRoutePayload($request);

        $route = DB::transaction(function () use ($validated) {
            $route = Route::create([
                'route_name' => $validated['route_name'],
            ]);

            $this->syncStations($route, $validated['stations']);

            return $route;
        });

        return response()->json([
            'message' => 'Route created',
            'data' => $route->load('stations'),
        ], 201);
    }

    public function update(Request $request, Route $route)
    {
        $validated = $this->validateRoutePayload($request, $route->id);

        DB::transaction(function () use ($route, $validated) {
            $route->update(['route_name' => $validated['route_name']]);
            $this->syncStations($route, $validated['stations']);
        });

        return response()->json([
            'message' => 'Route updated',
            'data' => $route->load('stations'),
        ]);
    }

    public function destroy(Route $route)
    {
        $route->delete();

        return response()->json(['message' => 'Route deleted']);
    }

    private function validateRoutePayload(Request $request, ?int $routeId = null): array
    {
        $validated = $request->validate([
            'route_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('routes', 'route_name')->ignore($routeId),
            ],
            'stations' => 'required|array|min:2',
            'stations.*.station_id' => 'required|integer|exists:stations,id|distinct',
            'stations.*.stop_order' => 'required|integer|min:1|distinct',
            'stations.*.distance_km' => 'required|numeric|min:0',
        ]);

        $sorted = collect($validated['stations'])->sortBy('stop_order')->values();

        $orders = $sorted->pluck('stop_order');
        if ($orders->toArray() !== range(1, $orders->count())) {
            abort(422, 'Stop order must be a continuous sequence starting at 1.');
        }

        // Distance must strictly increase along the route — two different
        // stations can't sit at the same cumulative distance from the origin.
        $distances = $sorted->pluck('distance_km')->values();
        for ($i = 1; $i < $distances->count(); $i++) {
            if ($distances[$i] <= $distances[$i - 1]) {
                abort(422, 'Distance (km) must increase with each stop, in order.');
            }
        }

        return $validated;
    }

    private function syncStations(Route $route, array $stations): void
    {
        $syncData = collect($stations)->mapWithKeys(fn ($s) => [
            $s['station_id'] => [
                'stop_order' => $s['stop_order'],
                'distance_km' => $s['distance_km'],
            ],
        ])->all();

        $route->stations()->sync($syncData);
    }
}