<?php

use App\Http\Controllers\Api\StationController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\TrainController;

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

Route::prefix('trains')->group(function(){
    Route::get('/',[TrainController::class,'index']);
    Route::post('/',[TrainController::class,'store']);
    Route::delete('/{train}', [TrainController::class, 'destroy']);
});