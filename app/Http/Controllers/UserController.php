<?php

namespace App\Http\Controllers;

use App\Models\UserGoogle;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index() {
        $users = UserGoogle::with('roles')->get();
        
        $data= $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'created_at' => $user->created_at->toDateTimeString(),  
            ];
        });

        return response()->json($data);
    }
    public function updateRole(Request $request,$id) {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string|distinct',
        ]);
        $user = UserGoogle::findOrFail($id);
        $user->syncRoles($request->roles);
        return response()->json(['message' => 'Roles updated successfully'], 200);
    }
    public function getUserInfo(Request $request)
    {
        $providerId = $request->query('provider_id');
        $user = UserGoogle::with('roles')->where('provider_id', $providerId)->first();
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name'),
            'gender' => $user->gender,
            'image' => $user->image,

        ]);
    }
    public function updateUserInfo(Request $request) {
        $providerId=$request->query('provider_id');
        $user=UserGoogle::where('provider_id',$providerId)->first();
        $request->validate([
            'name' => 'required|string',
            'gender' => 'required|string',
        ]);
        $user->update(
            [
                'name' => $request->name,
                'gender' => $request->gender,
            ]
        );

        return response()->json(['message' => 'User info updated successfully'], 200);
    }
}   
