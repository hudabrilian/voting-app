<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CandidateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "name" => "required|string|max:255",
            "image" => "nullable",
            "image.*" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            "type" => "required|string|max:255",
            "class" => "required|string|max:255",
            "vision" => "required",
            "mission" => "required",
            "status" => "required|boolean",
        ];
    }
}
