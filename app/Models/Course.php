<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $fillable = [
        'category_id', 'title', 'slug', 'instructor', 'badge', 'description', 'highlights',
        'image', 'affiliate_url', 'price', 'original_price', 'is_free', 'is_featured',
        'is_published', 'sort_order',
    ];

    protected $appends = ['image_url', 'discount_percent'];

    protected function casts(): array
    {
        return [
            'highlights' => 'array',
            'price' => 'float',
            'original_price' => 'float',
            'is_free' => 'boolean',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'clicks_count' => 'integer',
            'sales_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Course $course) {
            if (blank($course->slug)) {
                $course->slug = static::uniqueSlug($course->title, $course->id);
            }
            if ($course->is_free) {
                $course->price = 0;
            }
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'course-'.Str::lower(Str::random(6));
        $slug = $base;
        $i = 2;
        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(Click::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }
        $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], trim($term)).'%';

        return $query->where(fn (Builder $q) => $q
            ->where('title', 'like', $like)
            ->orWhere('instructor', 'like', $like)
            ->orWhere('description', 'like', $like)
        );
    }

    public function getImageUrlAttribute(): ?string
    {
        if (blank($this->image)) {
            return null;
        }
        if (Str::startsWith($this->image, ['http://', 'https://', '/'])) {
            return $this->image;
        }

        return Storage::disk('uploads')->url($this->image);
    }

    public function getDiscountPercentAttribute(): ?int
    {
        if (! $this->original_price || ! $this->price || $this->original_price <= $this->price) {
            return null;
        }

        return (int) round((1 - $this->price / $this->original_price) * 100);
    }

    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
