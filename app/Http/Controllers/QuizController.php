<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Models\CorrectAnswer;

class QuizController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'time' => 'required|integer|min:1',
        ]);
        $quiz = Quiz::create([
            'title' => $validated['title'],
            'time' => $validated['time'],
        ]);
        return response()->json($quiz, 201);
    }
    public function index()
    {
        $quizzes = Quiz::all();
        return response()->json($quizzes);
    }
        public function destroy($id)
        {
            $quiz = Quiz::find($id);
            if (!$quiz) {
                return response()->json(['message' => 'Quiz not found'], 404);
            }
            foreach ($quiz->questions as $question) {
                $question->answers()->delete();
                $question->delete();
            }
            $quiz->delete();
            return response()->json(['message' => 'Quiz deleted successfully']);
        }

        public function update(Request $request, $id)
        {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'time' => 'required|integer|min:1',
            ]);
            $quiz = Quiz::find($id);
            if (!$quiz) {
                return response()->json(['message' => 'Quiz not found'], 404);  
            }
            $quiz->update($validatedData);
            return response()->json($quiz, 200); 
        }

        public function show($id)
        {
            $quiz = Quiz::find($id);
            if (!$quiz) {
                return response()->json(['message' => 'Quiz not found'], 404);
            }
        
            $questions = Question::where('quiz_id', $id)
                ->with(['answers', 'correctAnswers'])  
                ->get();
            $questions->transform(function ($question) {
                $question->correctAnswerIds = $question->correctAnswers->pluck('answer_id');
                return $question;
            });
            $correctAnswerIds = CorrectAnswer::where('question_id', $id)
        ->pluck('answer_id')
        ->toArray();
            return response()->json([
                'quiz' => $quiz,
                'questions' => $questions,
                'correctAnswerIds' => $correctAnswerIds
            ]);
        }
       
        

}