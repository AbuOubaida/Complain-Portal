<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class department extends Model
{
    use HasFactory;
    protected $fillable = ['dept_code', 'dept_name', 'status', 'remarks',];

    public function getUsers()
    {
        $this->hasMany(User::class,'dept_id');
    }
}
