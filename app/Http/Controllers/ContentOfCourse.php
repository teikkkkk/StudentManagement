<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TableOfContents;
use Illuminate\Support\Facades\Validator;

class ContentOfCourse extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'video_url' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
        $tableOfContents = TableOfContents::create($request->all());
        return response()->json($tableOfContents);
    }

}
