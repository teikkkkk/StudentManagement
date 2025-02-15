<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
     public function run(): void
    {
        $data = config('permission_data');

        if (empty($data) || !is_array($data)) return;

        foreach ($data as $group) {

            foreach ($group['permissions'] as $permissionKey => $permissionName) {
                $permission = Permission::where(
                    [
                        'name' => $permissionKey,
                        'guard_name' => 'web',
                    ]
                )->first();

                if (!$permission) {
                    Permission::create([
                        'name' => $permissionKey,
                        'permission_name' => $permissionName,
                        'guard_name' => 'web',
                    ]);
                } elseif ($permission->permission_name <> $permissionName) {
                    $permission->update(['permission_name' => $permissionName]);
                }
            }
        }
        $roles = [
            'admin' => Permission::all(),  
            'teacher' => array_keys($data['teacher_permission']['permissions']),  
            'student' =>array_keys($data['student_permission']['permissions']),  
        ];
        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->givePermissionTo($permissions);
        }
    }
    
}
