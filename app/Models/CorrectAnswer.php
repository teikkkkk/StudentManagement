<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorrectAnswer extends Model
{
    protected $table = 'correct_answer'; 
    protected $fillable = [
        'question_id',
        'answer_id',
    ];

    // Nếu có quan hệ với Question hoặc Answer, có thể khai báo thêm
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function answer()
    {
        return $this->belongsTo(Answer::class);
    }
}
