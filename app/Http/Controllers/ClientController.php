<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function listQuiz(){
        $quizs=Quiz::all();
        return view('listQuiz',compact('quizs'));
    }
    public function takeQuiz($id) {
        $quiz=Quiz::find($id);
        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }
        $questions=Question::where('quiz_id',$id)->with(['answer'])->get();
        return response()->json([
            'quiz'=>$quiz,'questions'=>$questions
        ]);
    }
}
