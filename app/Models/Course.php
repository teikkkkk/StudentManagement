<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'price',
        'start_date',
        'end_date',
        'teacher_id',
        'detail',
        'status',
        'max_students',
        'image',
        'video_url'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'price' => 'decimal:2',
        'schedule' => 'array'
    ];

    public function teacher()
    {
        return $this->belongsTo(UserGoogle::class, 'teacher_id');
    }

    public function schedule()
    {
        return $this->hasOne(CourseSchedule::class);
    }
}