<?php

namespace App\Http\Controllers;

use App\Models\UserGoogle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    public function googleSignIn(Request $request) {
        $request->validate([
            'access_token' => 'required',
        ]);
        try {
            $googleUser = Socialite::driver('google')->userFromToken($request->access_token);
            
            $user = UserGoogle::where('provider_id', $googleUser->id)
                             ->where('provider', 'google')
                             ->first();
                             
            if (!$user) {
                $user = UserGoogle::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'provider_id' => $googleUser->id,
                    'provider' => 'google',
                    'image' => $googleUser->image, 
                    'password' => Hash::make(uniqid()),
                ]);
                $user->assignRole('student');
            } else {
                 $user->update([
                    'image' => $googleUser->image
                ]);
            }
            
            Auth::login($user); 
            return response()->json([
                'message' => 'Đăng nhập thành công.',
                'user' => [
                    'name' => $user->name,
                    'role' => $user->getRoleNames(),
                    'avatar' => $user->image  
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Token không đúng hoặc hết hạn.',
                'message' => $e->getMessage()
            ], 400);
        }
    }
    

 }
    

