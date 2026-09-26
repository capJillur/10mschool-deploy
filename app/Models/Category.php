<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public const GROUP_ACADEMIC = 'academic';

    public const GROUP_SKILLS = 'skills';

    protected $fillable = ['group', 'name', 'slug', 'tagline', 'class_min', 'class_max', 'sort_order'];

    protected function casts(): array
    {
        return [
            'class_min' => 'integer',
            'class_max' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function publishedCourses(): HasMany
    {
        return $this->courses()->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
