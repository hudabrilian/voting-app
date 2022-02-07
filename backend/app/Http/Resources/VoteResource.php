<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => $this->user->name,
            'candidateMpk' => $this->candidateMpk->name,
            'candidateOsis' => $this->candidateOsis->name,
            'time' => $this->created_at->diffForHumans(),
        ];
    }
}
