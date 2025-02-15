<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSchedule extends Model
{
    protected $fillable = [
        'course_id',
        'type',
        'start_time',
        'end_time',
        'schedule_data'
    ];

    protected $casts = [
        'schedule_data' => 'array',
        'start_time' => 'datetime',
        'end_time' => 'datetime'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}