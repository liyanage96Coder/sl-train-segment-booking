<?php

use App\Http\Controllers\Api\StationController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\TrainController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuthController;


Route::post('/login', [AuthController::class, 'login']);


Route::prefix('routes')->group(function () {
    Route::get('/', [RouteController::class, 'index']);
    Route::get('/{route}', [RouteController::class, 'show']);
});

Route::get('/trains/for-leg', [TrainController::class, 'forLeg']);
Route::get('/trains/{train}/seat-map', [TrainController::class, 'seatMap']);
Route::post('/bookings', [BookingController::class, 'store']);


Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::prefix('stations')->group(function () {
        Route::get('/', [StationController::class, 'index']);
        Route::post('/', [StationController::class, 'store']);
        Route::post('/insert-between', [StationController::class, 'insertBetween']);
        Route::put('/{station}', [StationController::class, 'update']);
        Route::delete('/{station}', [StationController::class, 'destroy']);
    });

    Route::prefix('routes')->group(function () {
        Route::post('/', [RouteController::class, 'store']);
        Route::put('/{route}', [RouteController::class, 'update']);
        Route::delete('/{route}', [RouteController::class, 'destroy']);
    });

    Route::apiResource('trains', TrainController::class)->only(['index', 'store', 'destroy']);
    Route::get('/trains/{train}/booked-dates', [TrainController::class, 'bookedDates']);
    Route::get('/trains/{train}/schedule', [TrainController::class, 'schedule']);

    Route::get('/get-bookings', [BookingController::class, 'index']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
});