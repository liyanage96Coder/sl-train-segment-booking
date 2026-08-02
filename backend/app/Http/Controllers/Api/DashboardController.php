<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Trip;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBookings = Booking::count();
        $totalRevenue = Booking::sum('total_fare');
        $totalSeatsBooked = DB::table('booking_seats')->count();
        $localCount = (int) Booking::sum('local_count');
        $foreignCount = (int) Booking::sum('foreign_count');
        $upcomingTrips = Trip::where('travel_date', '>=', now()->toDateString())->count();

        $revenueByDay = Booking::selectRaw('DATE(created_at) as date, SUM(total_fare) as revenue, COUNT(*) as bookings')
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topRoutes = DB::table('bookings')
            ->join('trips', 'trips.id', '=', 'bookings.trip_id')
            ->join('trains', 'trains.id', '=', 'trips.train_id')
            ->join('routes', 'routes.id', '=', 'trains.route_id')
            ->select(
                'routes.route_name',
                DB::raw('SUM(bookings.total_fare) as revenue'),
                DB::raw('COUNT(*) as bookings')
            )
            ->groupBy('routes.id', 'routes.route_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        $trainOccupancy = DB::table('trains')
            ->join('train_coaches', 'train_coaches.train_id', '=', 'trains.id')
            ->select('trains.id', 'trains.train_name', DB::raw('SUM(train_coaches.seat_count) as total_seats'))
            ->groupBy('trains.id', 'trains.train_name')
            ->get()
            ->map(function ($train) {
                $booked = DB::table('booking_seats')
                    ->join('seats', 'seats.id', '=', 'booking_seats.seat_id')
                    ->join('train_coaches', 'train_coaches.id', '=', 'seats.train_coach_id')
                    ->where('train_coaches.train_id', $train->id)
                    ->count();

                return [
                    'train_name' => $train->train_name,
                    'total_seats' => (int) $train->total_seats,
                    'booked_seats' => $booked,
                    'occupancy_rate' => $train->total_seats > 0
                        ? round($booked / $train->total_seats * 100, 1)
                        : 0,
                ];
            })
            ->values();

        $recentBookings = Booking::with(['trip.train', 'fromStation', 'toStation'])
            ->latest()
            ->limit(6)
            ->get();

        return response()->json([
            'total_bookings' => $totalBookings,
            'total_revenue' => round($totalRevenue, 2),
            'total_seats_booked' => $totalSeatsBooked,
            'local_count' => $localCount,
            'foreign_count' => $foreignCount,
            'upcoming_trips' => $upcomingTrips,
            'revenue_by_day' => $revenueByDay,
            'top_routes' => $topRoutes,
            'train_occupancy' => $trainOccupancy,
            'recent_bookings' => $recentBookings,
        ]);
    }
}