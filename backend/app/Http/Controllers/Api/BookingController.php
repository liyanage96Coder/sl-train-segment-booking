<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'train_id' => 'required|integer|exists:trains,id',
            'travel_date' => 'required|date|after_or_equal:today',
            'from_station_id' => 'required|integer|exists:stations,id',
            'to_station_id' => 'required|integer|exists:stations,id|different:from_station_id',
            'passenger_name' => 'nullable|string|max:255',
            'seats' => 'required|array|min:1',
            'seats.*.seat_id' => 'required|integer|exists:seats,id|distinct',
            'seats.*.passenger_type' => 'required|in:local,foreign',
        ]);

        try {
            $booking = $this->bookingService->createBooking($validated);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Booking conflict',
                'errors' => $e->errors(),
            ], 409);
        }

        return response()->json([
            'message' => 'Booking confirmed',
            'data' => $booking,
        ], 201);
    }
}