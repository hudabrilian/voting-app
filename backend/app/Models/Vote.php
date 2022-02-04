<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'candidateMpk_id', 'candidateOsis_id', 'confirm'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function candidateMpk()
    {
        return $this->belongsTo(Candidate::class, 'candidateMpk_id', 'id');
    }

    public function candidateOsis()
    {
        return $this->belongsTo(Candidate::class, 'candidateOsis_id', 'id');
    }
}
