<?php

namespace App\Models;

use SelectedAnswer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QuizSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'quiz_id',
        'score',
        'time_taken',
    ];

   
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
  
    
}
