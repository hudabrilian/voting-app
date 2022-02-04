<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CandidateResource;
use App\Http\Requests\CandidateRequest;
use App\Models\Candidate;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\Vote;

class CandidateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return CandidateResource::collection(Candidate::paginate(10));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function candidates()
    {
        $hasVote = Vote::where('user_id', auth()->user()->id)->exists();

        return response()->json([
            'hasVote' => $hasVote,
            'mpk' => CandidateResource::collection(Candidate::where('type', 'mpk')->where('status', 1)->get()),
            'osis' => CandidateResource::collection(Candidate::where('type', 'osis')->where('status', 1)->get()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Requests\CandidateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CandidateRequest $request)
    {
        $data = $request->validated();

        if ($request->has('image')) {
            $image = $request->file('image');
            $filename = time().rand(1, 3). '.'.$image->getClientOriginalExtension();
            $image->move('uploads/', $filename);

            $data['image'] = 'uploads/' . $filename;
        }
        
        $candidate = Candidate::create($data);

        return new CandidateResource($candidate);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Candidate $candidate)
    {
        return new CandidateResource($candidate);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Requests\CandidateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CandidateRequest $request, Candidate $candidate)
    {
        $data = $request->validated();

        if ($request->has('image')) {
            $image = $request->file('image');
            $filename = time().rand(1, 3). '.'.$image->getClientOriginalExtension();
            $image->move('uploads/', $filename);

            // $relativePath = $this->saveImage($data['image']);
            // $data['image'] = $relativePath;

            // If there is an old image, delete it
            if ($candidate->image) {
                File::delete(public_path($candidate->image));
            }

            $data['image'] = 'uploads/' . $filename;
        }

        $candidate->update($data);

        return new CandidateResource($candidate);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Candidate $candidate)
    {
        $candidate->delete();

        if ($candidate->image) {
            $absolutePath = public_path($candidate->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }

    /**
     * Save image in local file system and return saved image path
     *
     * @param $image
     * @throws \Exception
     */
    private function saveImage($image)
    {
        // // Check if image is valid base64 string
        // if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
        //     // Take out the base64 encoded text without mime type
        //     $image = substr($image, strpos($image, ',') + 1);
        //     // Get file extension
        //     $type = strtolower($type[1]); // jpg, png, gif

        //     // Check if file is an image
        //     if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
        //         throw new \Exception('invalid image type');
        //     }
        //     $image = str_replace(' ', '+', $image);
        //     $image = base64_decode($image);

        //     if ($image === false) {
        //         throw new \Exception('base64_decode failed');
        //     }
        // } else {
        //     throw new \Exception('did not match data URI with image data');
        // }

        $type = $image->getClientOriginalExtension();

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }
}
