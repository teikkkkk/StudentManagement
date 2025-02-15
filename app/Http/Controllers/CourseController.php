<?php

namespace App\Http\Controllers;

use Log;
use App\Models\Course;
use App\Models\UserGoogle;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Models\CourseSchedule;
use Illuminate\Support\Facades\Validator;
use App\Models\TableOfContents;
class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();
    
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'teacher_id' => 'required|exists:users_google,id',
            'detail' => 'nullable|string',
            'max_students' => 'nullable|integer|min:0',
            'schedule.type' => 'required|in:weekly,custom',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'video_url' => 'nullable|string',
            'schedule.time.start' => 'required|date_format:H:i',
            'schedule.time.end' => 'required|date_format:H:i|after:schedule.time.start',
            'schedule.days' => 'required_if:schedule.type,weekly|array',
            'schedule.dates' => 'required_if:schedule.type,custom|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        $courseData = [
            'name' => $request->name,
            'price' => $request->price, 
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'teacher_id' => $request->teacher_id,
            'detail' => $request->detail,
            'max_students' => $request->max_students,
            'video_url' => $request->video_url
        ];
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('course_images', 'public');
            $courseData['image'] = $imagePath;
        }
         
        $course = Course::create($courseData);
            $scheduleData = $request->schedule['type'] === 'weekly' 
                ? $request->schedule['days']
                : $request->schedule['dates'];

            CourseSchedule::create([
                'course_id' => $course->id,
                'type' => $request->schedule['type'],
                'start_time' => $request->schedule['time']['start'],
                'end_time' => $request->schedule['time']['end'],
                'schedule_data' => $scheduleData
            ]);
            return response()->json([
                'message' => 'Khóa học đã được tạo thành công',
                'data' => $course->load('schedule'),
            ], 201);

    }
    public function show($id)
    {
            $course = Course::with('schedule')->findOrFail($id);
            $teacher=UserGoogle::role('teacher')->where('id', $course->teacher_id)->get();
            $tableOfContents = TableOfContents::where('course_id', $id)->get();
            return response()->json([
                'course' => $course,
                'teacher' => $teacher,
                'tableOfContents' => $tableOfContents
            ]);
    }
    public function update(Request $request, $id)
{
    $course = Course::findOrFail($id);  
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'teacher_id' => 'required|exists:users_google,id',
        'detail' => 'nullable|string',
        'max_students' => 'nullable|integer|min:0',
        'video_url' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'schedule.type' => 'required|in:weekly,custom',
        'schedule.time.start' => 'required|date_format:H:i',
        'schedule.time.end' => 'required|date_format:H:i|after:schedule.time.start',
        'schedule.days' => 'required_if:schedule.type,weekly|array',
        'schedule.dates' => 'required_if:schedule.type,custom|array'
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }
    $courseData = [
        'name' => $request->name,
        'price' => $request->price, 
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'teacher_id' => $request->teacher_id,
        'detail' => $request->detail,
        'max_students' => $request->max_students,
        'video_url' => $request->video_url
    ];
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('course_images', 'public');
        $courseData['image'] = $imagePath;
    }
    $course->update($courseData);
    $scheduleData = $request->schedule['type'] === 'weekly' 
        ? $request->schedule['days']
        : $request->schedule['dates'];

    $course->schedule()->updateOrCreate(
        ['course_id' => $course->id],
        [
            'type' => $request->schedule['type'],
            'start_time' => $request->schedule['time']['start'],
            'end_time' => $request->schedule['time']['end'],
            'schedule_data' => $scheduleData
        ]
    );

    return response()->json([
        'message' => 'Khóa học đã được cập nhật thành công',
        'data' => $course->load('schedule'),
        ], 200);
    }
    public function destroy($id)
        {
            $course = Course::find($id);
            if (!$course) {
                return response()->json(['message' => 'Course not found'], 404);
            }
            $course->delete();
            return response()->json(['message' => 'Course deleted successfully']);
        }
      
}