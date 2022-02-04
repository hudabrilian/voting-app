<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'mpk' => 'required|exists:candidates,id',
            'osis' => 'required|exists:candidates,id',
        ]);

        $hasVote = Vote::where('user_id', auth()->user()->id)->exists();

        if ($hasVote) return response()->json(['message' => 'You have already voted'], 400);

        Vote::create([
            'user_id' => auth()->user()->id,
            'candidateMpk_id' => $request->mpk,
            'candidateOsis_id' => $request->osis
        ]);

        return response()->json([
            'message' => 'You have successfully voted'
        ]);
    }
}
