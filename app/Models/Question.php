<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = [
        'quiz_id',
        'question',
        'image',
        'audio',
        'video'
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function correctAnswers()
    {
        return $this->hasMany(CorrectAnswer::class, 'question_id');
    }
    public function selectedAnswers()
    {
        return $this->hasMany(SelectedAnswer::class, 'question_id');
    }
}
