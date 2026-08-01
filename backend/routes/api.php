<?php

use App\Http\Controllers\Api\StationController;


Route::prefix('stations')->group(function(){
    Route::get('/',[StationController::class,'index']);
    Route::post('/',[StationController::class,'store']);
    Route::post('/insert-between',[StationController::class,'insertBetween']);
});