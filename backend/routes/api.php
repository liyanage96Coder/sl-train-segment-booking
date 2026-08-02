<?php

use App\Http\Controllers\Api\StationController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\TrainController;
use App\Http\Controllers\Api\BookingController;

Route::prefix('stations')->group(function(){
    Route::get('/',[StationController::class,'index']);
    Route::post('/',[StationController::class,'store']);
    Route::post('/insert-between',[StationController::class,'insertBetween']);
    Route::put('/{station}', [StationController::class, 'update']);
    Route::delete('/{station}', [StationController::class, 'destroy']);
});

Route::prefix('routes')->group(function(){
    Route::get('/',[RouteController::class,'index']);
    Route::get('/{route}', [RouteController::class, 'show']);
    Route::post('/',[RouteController::class,'store']);
    Route::put('/{route}', [RouteController::class, 'update']);
    Route::delete('/{route}', [RouteController::class, 'destroy']);
});

Route::get('/trains/for-leg', [TrainController::class, 'forLeg']);
Route::get('/trains/{train}/seat-map', [TrainController::class, 'seatMap']);
Route::apiResource('trains', TrainController::class)->only(['index', 'store', 'destroy']);

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/get-bookings', [BookingController::class, 'index']);
Route::get('/trains/{train}/schedule', [TrainController::class, 'schedule']);
Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);