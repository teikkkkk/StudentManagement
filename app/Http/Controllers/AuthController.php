<?php

namespace App\Http\Controllers;

use App\Models\User;
use Twilio\Rest\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }
    public function registerform()
    {
        return view('auth.register');
    }
    public function sendOtp(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|numeric',
            'password' => 'required|string|confirmed',
        ]);
        
        $otp = rand(100000, 999999); 
        $phone = $request->input('phone');
        
        session(['otp' => $otp, 'phone' => $phone, 'name' => $request->input('name')]);

        $twilioSid = "";
        $authToken = "";
        $twilioNumber = "";
        $twilio = new Client($twilioSid, $authToken);
            $twilio->messages->create( '+84' . substr($phone, 1),
                [
                    "from" => $twilioNumber,
                    "body" => " $otp",
              
                ]
            );
           

        return redirect()->route('showOtpForm');
    }

    public function showOtpForm()
    {
        return view('auth.verify-otp');
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|numeric',
        ]);
    
        $otp = $request->input('otp');
        $phone = session('phone');
        $name = session('name');
        $sessionOtp = session('otp');
     
        if ($otp == $sessionOtp) {
            $user = User::updateOrCreate(
                ['phone' => $phone],  
                [
                    'name' => $name,
                    'password' => Hash::make(session('password'))  
                ]
            );
            session()->forget(['otp', 'phone', 'name', 'password']);
            return redirect()->route('loginform')->with('success', 'Đăng kí thành công');
        } else {
            return redirect()->back()->with('error', 'Mã OTP bị lỗi.Vui long thử lại thư lại');
        }
    }
    
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);
        $user = User::where('phone', $request->phone)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'SĐT hoặc mật khẩu sai'], 401);
        }
        Auth::login($user, $request->has('remember'));
        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
    

    public function home(){
        return view('dashboard');
    }
    public function showForgotPasswordForm()
    {
        return view('auth.forgotPassword');
    }
    
    public function sendPasswordResetOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|numeric',
        ]);
    
        $otp = rand(100000, 999999); 
        $phone = $request->input('phone');
        
        session(['password_reset_otp' => $otp, 'phone_for_reset' => $phone]);
    
        $twilioSid = "";
        $authToken = "";
        $twilioNumber = "+";
        $twilio = new Client($twilioSid, $authToken);
            $twilio->messages->create( '+84' . substr($phone, 1),
                [
                    "from" => $twilioNumber,
                    "body" => " $otp",
              
                ]
            );
           

    
        return redirect()->route('showResetPasswordForm');
    }
    
    public function showResetPasswordForm()
    {
        return view('auth.resetPassword');
    }
    
    public function resetPassword(Request $request)
    {
        $request->validate([
            'otp' => 'required|numeric',
            'password' => 'required|string|confirmed',
        ]);
    
        $otp = $request->input('otp');
        $phone = session('phone_for_reset');
        $sessionOtp = session('password_reset_otp');
    
        if ($otp == $sessionOtp) {
            $user = User::where('phone', $phone)->first();
            if ($user) {
                $user->password = Hash::make($request->input('password'));
                $user->save();
    
                session()->forget(['password_reset_otp', 'phone_for_reset']);
                return redirect()->route('loginform')->with('success', 'Đổi mật khẩu thành công');
            } else {
                return redirect()->back()->with('error', 'Tài khoản không tồn tại');
            }
        } else {
            return redirect()->back()->with('error', 'Mã OTP sai');
        }
    }

}
