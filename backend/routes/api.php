<?php

use App\Http\Controllers\Api\StationController;
use App\Http\Controllers\Api\RouteController;


Route::prefix('stations')->group(function(){
    Route::get('/',[StationController::class,'index']);
    Route::post('/',[StationController::class,'store']);
    Route::post('/insert-between',[StationController::class,'insertBetween']);
    Route::put('/{station}', [StationController::class, 'update']);
    Route::delete('/{station}', [StationController::class, 'destroy']);
});

Route::prefix('routes')->group(function(){
    Route::get('/',[RouteController::class,'index']);
    Route::post('/',[RouteController::class,'store']);
    Route::put('/{route}', [RouteController::class, 'update']);
    Route::delete('/{route}', [RouteController::class, 'destroy']);
});