<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelectedAnswer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'quiz_id',
        'question_id',
        'answer_id',
        'submission_id'
    ];

    /**
     * Get the quiz that the selected answer belongs to.
     */
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    // Lấy thông tin đáp án tương ứng
    public function answer()
    {
        return $this->belongsTo(Answer::class, 'answer_id');
    }
    
}