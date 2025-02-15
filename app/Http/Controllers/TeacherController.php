<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\CourseSchedule;
use App\Models\UserGoogle;

class TeacherController extends Controller
{
    
    public function index($providerId)
    {
        $teacher = UserGoogle::where('provider_id', $providerId)->first();
        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found.',
            ], 404);
        }
    $courses = Course::with('schedule')
        ->where('teacher_id', $teacher->id)
        ->get(['id', 'name', 'start_date', 'end_date']);
        if ($courses->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No courses found for this teacher.',
            ], 404);
        }
        $schedules = $courses->map(function ($course) {
            if ($course->schedule) {
                return [
                    'course_name' => $course->name,
                    'schedule' => [
                        'type' => $course->schedule->type,
                        'start_time' => $course->schedule->start_time,
                        'end_time' => $course->schedule->end_time,
                        'schedule_data' => $course->schedule->schedule_data,
                        'start_date' => $course->start_date,
                        'end_date' => $course->end_date,
                    ],
                ];
            }
            return null;
        })->filter(); 

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }
    public function listTeacher(){
        $teachers = UserGoogle::role('teacher')->get();
        return response()->json([
            'success' => true,
            'data' => $teachers,
        ]);
    }
}
