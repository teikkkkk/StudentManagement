<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContentOfCourse;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\TakeQuizController;

Route::options('/{any}', function () {
    return response()->json(['status' => 'OK'], 200);
})->where('any', '.*');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/quizzes', [QuizController::class, 'store']);
Route::get('/quizzes', [QuizController::class, 'index']);
Route::put('/quizzes/{id}', [QuizController::class, 'update']);
Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
Route::get('quizzes/details/{id}', [QuizController::class, 'show']);
Route::post('/AddQuestions/{quiz}', [QuestionController::class, 'store']);
Route::delete('/DeleteQuestions/{questionId}', [QuestionController::class, 'destroy']);
Route::put('/EditQuestion/{questionId}', [QuestionController::class, 'update']);
Route::delete('/deleteAnswer/{answerId}', [QuestionController::class, 'deleteaAnswer']);
Route::get('listQuestion/{id}', [TakeQuizController::class, 'TakeQuiz']);
Route::post('/submitQuiz', [TakeQuizController::class, 'submit']);
Route::get('/quiz-result/{SubmissionId}', [TakeQuizController::class, 'QuizResult']);
Route::get('/ListSubmission/{quizId}', [TakeQuizController::class, 'ListSubmission']);
Route::get('/quizzes/review/{quizId}', [TakeQuizController::class, 'review']);
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/login-social/google', [LoginController::class, 'googleSignIn']);
Route::middleware(['role:teacher'])->group(function () {
});
Route::get('/user', [UserController::class, 'index']);
Route::get('/user/info', [UserController::class, 'getUserInfo']);
Route::get('/courses',[CourseController::class,'index']);
Route::post('/courses', [CourseController::class,'store']); 
Route::put('/user/{id}/role', [UserController::class, 'updateRole']); 

Route::prefix('courses')->group(function () {
    Route::get('/', [CourseController::class, 'index']);
    Route::post('/', [CourseController::class, 'store']);
    Route::get('/{id}', [CourseController::class, 'show']);
    Route::put('/{id}', [CourseController::class, 'update']);
    Route::delete('/{id}', [CourseController::class, 'destroy']);
});

Route::get('teachers/{teacherId}/schedule', [TeacherController::class, 'index']);
Route::get('teachers', [TeacherController::class, 'listTeacher']);
Route::put('user', [UserController::class, 'updateUserInfo']);
Route::get('courses/{courseId}/contents', [ContentOfCourse::class, 'getContentOfCourse']);