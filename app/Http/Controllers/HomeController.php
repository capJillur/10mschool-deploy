<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Course;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $categories = Category::ordered()
            ->withCount('publishedCourses')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'group' => $c->group,
                'name' => $c->name,
                'slug' => $c->slug,
                'tagline' => $c->tagline,
                'class_min' => $c->class_min,
                'class_max' => $c->class_max,
                'courses_count' => $c->published_courses_count,
                'thumb' => $c->publishedCourses()->orderByDesc('clicks_count')->value('image'),
            ])
            ->map(function ($c) {
                $c['thumb'] = $c['thumb'] ? (new Course(['image' => $c['thumb']]))->image_url : null;

                return $c;
            });

        $featured = Course::published()->with('category:id,name,slug,group')
            ->where('is_featured', true)
            ->orderBy('sort_order')->orderByDesc('clicks_count')
            ->limit(6)->get();

        $popular = Course::published()->with('category:id,name,slug,group')
            ->orderByDesc('clicks_count')->orderByDesc('id')
            ->limit(8)->get();

        $free = Course::published()->with('category:id,name,slug,group')
            ->where('is_free', true)
            ->orderByDesc('clicks_count')
            ->limit(4)->get();

        return Inertia::render('Home', [
            'banners' => Banner::active()->get(),
            'categories' => $categories,
            'featured' => $featured,
            'popular' => $popular,
            'free' => $free,
            'stats' => [
                'courses' => Course::published()->count(),
                'skills' => Course::published()->whereHas('category', fn ($q) => $q->where('group', Category::GROUP_SKILLS))->count(),
                'free' => Course::published()->where('is_free', true)->count(),
                'academic' => Course::published()->whereHas('category', fn ($q) => $q->where('group', Category::GROUP_ACADEMIC))->count(),
            ],
        ]);
    }
}
