<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Lấy giá trị cookie 'role'
        $cookieRole = json_decode($request->cookie('role'), true);

        // Kiểm tra xem role có trong cookie không
        if (!is_array($cookieRole) || !in_array($role, $cookieRole)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}