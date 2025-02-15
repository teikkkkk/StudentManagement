<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Models\CorrectAnswer;
class QuestionController extends Controller
{
   public function store(Request $request, $quizId)
    {

        $validated = $request->validate([
            'question' => 'required|string',
            'answers' => 'required|array',
            'answers.*.answer' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
            'image' => 'nullable|string',
            'audio' => 'nullable|string',
            'video' => 'nullable|string',
        ]);
    
        $question = Question::create([
            'quiz_id' => $quizId,
            'question' => $validated['question'],
            'image' => $validated['image'] ?? null,  
            'audio' => $validated['audio'] ?? null, 
            'video' => $validated['video'] ?? null,
        ]);
        $correctAnswerIds = [];
        foreach ($validated['answers'] as $answerData) {
            $answer = Answer::create([
                'question_id' => $question->id,
                'answer' => $answerData['answer'],
            ]);
            if ($answerData['is_correct']) {
                $correctAnswerIds[] = $answer->id; 
            }
        }
        foreach ($correctAnswerIds as $answerId) {
            CorrectAnswer::create([
                'question_id' => $question->id,
                'answer_id' => $answerId,
            ]);
                } 
            $correctAnswerIds = CorrectAnswer::where('question_id',  $question->id)
                ->pluck('answer_id')
                ->toArray();
                $answer = Answer::where("question_id", $question->id)->get();
                    return response()->json([
                        'question' => $question,
                        'answers' => $answer,
                        'correctAnswerIds' => $correctAnswerIds
                    ]);
            }
    
            public function update(Request $request, $questionId)
            {

                $validated = $request->validate([
                    'question' => 'required|string',
                    'answers' => 'required|array',
                    'answers.*.id' => 'nullable|integer|exists:answers,id',
                    'answers.*.answer' => 'required|string',
                    'answers.*.is_correct' => 'required|boolean',
                ]);
            
                $question = Question::findOrFail($questionId);
                $question->update(['question' => $validated['question']]);
                $correctAnswerIds = CorrectAnswer::where('question_id', $questionId)->pluck('answer_id')->toArray();
                $newCorrectAnswerIds = [];
                foreach ($validated['answers'] as $answerData) {
                    if (isset($answerData['id'])) {
                        $answer = Answer::findOrFail($answerData['id']);
                        $answer->update(['answer' => $answerData['answer']]);
            
                        if ($answerData['is_correct']) {
                            if (!in_array($answer->id, $correctAnswerIds)) {
                                CorrectAnswer::create([
                                    'question_id' => $questionId,
                                    'answer_id' => $answer->id,
                                ]);
                            }
                            $newCorrectAnswerIds[] = $answer->id;
                        } else {
                            if (in_array($answer->id, $correctAnswerIds)) {
                                CorrectAnswer::where('question_id', $questionId)->where('answer_id', $answer->id)->delete();
                            }
                        }
                    } else {
                        $answer = Answer::create([
                            'question_id' => $questionId,
                            'answer' => $answerData['answer'],
                        ]);
            
                        if ($answerData['is_correct']) {
                            CorrectAnswer::create([
                                'question_id' => $questionId,
                                'answer_id' => $answer->id,
                            ]);
                            $newCorrectAnswerIds[] = $answer->id;
                        }
                    }
                }
            
                $answers = Answer::where('question_id', $question->id)->get();
                
                return response()->json([
                    'question' => $question,
                    'answers' => $answers,
                    'correctAnswerIds' => $newCorrectAnswerIds,
                ]);
            }
            

                public function destroy( $questionId)
            {
                $question = Question::findOrFail($questionId);
                $question->delete();
                return response()->json(['message' => 'Question deleted successfully'], 200);
            }
            public function deleteaAnswer($id)
            {
                $answer = Answer::findOrFail($id);
    
                $answer->delete();
                CorrectAnswer::where('answer_id', $id)->delete();
            
                return response()->json(['message' => 'Answer deleted successfully']);
            }
            
}

