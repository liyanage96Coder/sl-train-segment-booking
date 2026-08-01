<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{

    return [
        'station_name'=>'required|max:255',
        'station_code'=>'required|max:10|unique:stations',
        'station_order'=>'required|integer|unique:stations'
    ];

}
}