<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class UserGoogle extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $table = 'users_google';
    protected $guard_name = 'web';

    protected $fillable = [
        'name',
        'email',
        'password',
        'provider',
        'provider_id',
        'gender',
        'image',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    public function hasSpecificRole($role)
    {
        return $this->hasRole($role);
    }
    public function hasSpecificPermission($permission)
    {
        return $this->can($permission);
    }
    public function course(){
        return $this->hasMany(Course::class,'user_google_id');
    }

}
