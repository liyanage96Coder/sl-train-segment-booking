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
            "message"=>"Station added",
            "data"=>$station
        ],201);
    }



    public function insertBetween(Request $request)
    {

        $request->validate([
            'previous_station_id'=>'required|exists:stations,id',
            'station_name'=>'required',
            'station_code'=>'required|unique:stations,station_code'
        ]);



        DB::transaction(function() use($request){
            $previousStation =
                Station::find(
                    $request->previous_station_id
                );
            $newOrder =
                $previousStation->station_order + 1;
            // move following stations forward
            Station::where(
                'station_order',
                '>=',
                $newOrder
            )
            ->increment('station_order');

            Station::create([
                'station_name'=>$request->station_name,
                'station_code'=>$request->station_code,
                'station_order'=>$newOrder
            ]);


        });



        return response()->json([
            "message"=>"Station inserted successfully"
        ]);

    }



}