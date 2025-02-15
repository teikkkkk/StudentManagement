<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quiz'; 

    protected $fillable = ['title', 'time'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
    public function selectedAnswers()
    {
        return $this->hasMany(SelectedAnswer::class);
    }
    public function QuizSubmission()
    {
        return $this->hasMany(QuizSubmission::class);
    }
}
