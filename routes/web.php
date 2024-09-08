<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
 
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('loginform');
Route::get('/home', [AuthController::class, 'home'])->name('home');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/register', [AuthController::class, 'registerform'])->name('registerform');
Route::post('/register', [AuthController::class, 'sendOtp'])->name('sendOtp');
Route::get('/verify-otp', [AuthController::class, 'showOtpForm'])->name('showOtpForm');
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('verifyOtp');
Route::get('forgot-password', [AuthController::class, 'showForgotPasswordForm'])->name('forgotPasswordForm');
Route::post('send-password-reset-otp', [AuthController::class, 'sendPasswordResetOtp'])->name('sendPasswordResetOtp');
Route::get('reset-password', [AuthController::class, 'showResetPasswordForm'])->name('showResetPasswordForm');
Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('resetPassword');
