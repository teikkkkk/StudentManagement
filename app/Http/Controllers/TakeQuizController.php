<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Models\CorrectAnswer;
use App\Models\SelectedAnswer;
use App\Models\QuizSubmission;
use Carbon\Carbon;

class TakeQuizController extends Controller
{
    public function TakeQuiz($id)
{
    $quiz = Quiz::find($id);
    $questions = Question::where('quiz_id', $id)->with(['answers', 'correctAnswers'])->get();
    $questions->transform(function ($question) {
        $question->correctAnswerIds = $question->correctAnswers->pluck('answer_id');
        return $question;
    });
        $currentTime=Carbon::now();
        $endTime=$currentTime->addMinutes($quiz->time);
    return response()->json([
        'quiz' => $quiz, 'questions' => $questions,
        'endTime' => $endTime->toDateTimeString()
    ]);

}   
public function submit(Request $request)
{
    $request->validate([
        'quiz_id' => 'required|integer',
        'time_taken' => 'required|integer',
        'answers' => 'nullable|array', 
        'answers.*.question_id' => 'required|integer',
        'answers.*.answer_id' => 'required|integer',
    ]);
    $quizSubmission = QuizSubmission::create([
        'quiz_id' => $request->quiz_id,
        'score' => 0,
        'time_taken' => $request->time_taken,
    ]);
    session()->put('quiz_submission_id', $quizSubmission->id);
    if ($request->has('answers')) {
        foreach ($request->answers as $answer) {
            SelectedAnswer::create([
                'quiz_id' => $request->quiz_id,
                'question_id' => $answer['question_id'],
                'answer_id' => $answer['answer_id'],
                'submission_id' => $quizSubmission->id, 
            ]);
        }
    }
    $questions = Question::where('quiz_id', $request->quiz_id)->get();
    $questions->transform(function ($question) {
        $question->correctAnswerIds = $question->correctAnswers->pluck('answer_id');
        return $question;
    });

    $score = 0;
    $totalQuestions = $questions->count();
    $selectedAnswers = collect($request->answers ?? [])->groupBy('question_id');

    foreach ($questions as $question) {
        $answersForQuestion = $selectedAnswers->get($question->id);
        if (!$answersForQuestion) {
            continue;
        }
        if (
            $answersForQuestion->pluck('answer_id')->intersect($question->correctAnswerIds)->count() === $question->correctAnswerIds->count() &&
            $answersForQuestion->pluck('answer_id')->diff($question->correctAnswerIds)->isEmpty()
        ) {
            $score++; 
        }
    }
    $quizSubmission->update([
        'score' => $score,
    ]);
    return response()->json([
        'score' => $score,
        'totalQuestions' => $totalQuestions,
    ], 200);
}


    public function ListSubmission($quizId) { 
        $submissions = QuizSubmission::where('quiz_id', $quizId)->get()->toArray();
        return response()->json($submissions);
    }
    
    public function QuizResult($submissionId)
    {
        $quizSubmission = QuizSubmission::where('id', $submissionId)->firstOrFail();
        $quizId = $quizSubmission->quiz_id;
        $selectedAnswers = SelectedAnswer::where('submission_id', $submissionId)->get();
            $questions = Question::where('quiz_id', $quizId)->with(['answers', 'correctAnswers'])->get();
        $questions->transform(function ($question) {
            $question->correctAnswerIds = $question->correctAnswers->pluck('answer_id');
            return $question;
        });
            return response()->json([
            'questions' => $questions,
            'quiz_title' => $quizSubmission->quiz->title,
            'score' => $quizSubmission->score,
            'time_taken' => $quizSubmission->time_taken,
            'selected_answers' => $selectedAnswers->map(function ($answer) {
                return [
                    'question_id' => $answer->question_id,
                    'selected_answer_id' => $answer->answer_id,
                ];
            }),
        ]);
    }
    
}
