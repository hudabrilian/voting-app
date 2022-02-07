<?php

namespace App\Http\Controllers;

use App\Http\Resources\VoteResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vote;
use App\Models\Candidate;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userTotal = User::count();
        $userVoted = Vote::count();
        $userNoVoted = $userTotal - $userVoted;

        $datas = Candidate::get();

        $data = [
            'mpk' => [
                'name' => [],
                'count' => []
            ],
            'osis' => [
                'name' => [],
                'count' => []
            ]
        ];

        foreach ($datas as $dt) {
            if ($dt->type == "mpk") {
                array_push($data['mpk']['name'], $dt->name);
                array_push($data['mpk']['count'], $this->countCandidate("mpk", $dt->id));
            } else if ($dt->type == "osis") {
                array_push($data['osis']['name'], $dt->name);
                array_push($data['osis']['count'], $this->countCandidate("osis", $dt->id));
            }
        }

        // return VoteResource::collection(Vote::paginate(10), [
        //     'userTotal' => $userTotal,
        //     'userVoted' => $userVoted,
        //     'userNoVoted' => $userNoVoted,

        //     'dataNameMpk' => $data['mpk']['name'],
        //     'dataNameOsis' => $data['osis']['name'],
        //     'dataCountMpk' => $data['mpk']['count'],
        //     'dataCountOsis' => $data['osis']['count'],
        // ])->response();

        return response()->json([
            'votes' => VoteResource::collection(Vote::paginate(1))->response()->getData(true),

            'userTotal' => $userTotal,
            'userVoted' => $userVoted,
            'userNoVoted' => $userNoVoted,

            'dataNameMpk' => $data['mpk']['name'],
            'dataNameOsis' => $data['osis']['name'],
            'dataCountMpk' => $data['mpk']['count'],
            'dataCountOsis' => $data['osis']['count'],
        ]);
    }

    private function countCandidate($type, $id)
    {
        if ($type == "mpk") {
            $data = Vote::where('candidateMpk_id', $id)->count();
        } else if ($type == "osis") {
            $data = Vote::where('candidateOsis_id', $id)->count();
        } else {
            $data = 0;
        }

        return $data;
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
