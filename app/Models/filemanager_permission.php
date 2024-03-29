<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class filemanager_permission extends Model
{
    use HasFactory;
    protected $table = 'file_manager_permissions';
    protected $fillable = ['status', 'user_id', 'dir_name', 'permission_type', 'created_at', 'updated_at'];
}
