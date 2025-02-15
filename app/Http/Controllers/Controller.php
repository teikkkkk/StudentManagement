<?php

namespace App\Http\Controllers;

abstract class Controller
{
    //
    public function error($mes,$errors = []){
        return response()->json([
            'status'=>'error',
            'message' => $mes,
            'errors' => $errors
        ], 400);
    }
}
