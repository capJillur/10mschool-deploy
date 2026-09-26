<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'group' => in_array($request->query('group'), ['academic', 'skills']) ? $request->query('group') : null,
            'category' => $request->query('category'),
            'class' => $request->integer('class') ?: null,
            'free' => $request->boolean('free'),
            'sort' => in_array($request->query('sort'), ['popular', 'newest', 'price_asc', 'price_desc']) ? $request->query('sort') : 'popular',
        ];

        $categories = Category::ordered()->withCount('publishedCourses')->get();

        $activeCategory = $filters['category']
            ? $categories->firstWhere('slug', $filters['category'])
            : null;

        $query = Course::published()->with('category:id,name,slug,group');

        if ($activeCategory) {
            $query->where('category_id', $activeCategory->id);
            $filters['group'] = $activeCategory->group;
        } elseif ($filters['class']) {
            $query->whereHas('category', fn ($q) => $q
                ->where('class_min', '<=', $filters['class'])
                ->where('class_max', '>=', $filters['class']));
            $filters['group'] = 'academic';
        } elseif ($filters['group']) {
            $query->whereHas('category', fn ($q) => $q->where('group', $filters['group']));
        }

        if ($filters['free']) {
            $query->where('is_free', true);
        }

        $query->search($filters['q']);

        match ($filters['sort']) {
            'newest' => $query->orderByDesc('id'),
            'price_asc' => $query->orderBy('price')->orderByDesc('clicks_count'),
            'price_desc' => $query->orderByDesc('price')->orderByDesc('clicks_count'),
            default => $query->orderByDesc('clicks_count')->orderBy('sort_order')->orderByDesc('id'),
        };

        $courses = $query->paginate(12)->withQueryString();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $filters,
            'activeCategory' => $activeCategory,
        ]);
    }

    public function show(Course $course): Response
    {
        abort_unless($course->is_published, 404);

        $course->load('category:id,name,slug,group,tagline');

        $related = Course::published()->with('category:id,name,slug,group')
            ->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->orderByDesc('clicks_count')
            ->limit(4)->get();

        if ($related->count() < 4) {
            $more = Course::published()->with('category:id,name,slug,group')
                ->whereNotIn('id', $related->pluck('id')->push($course->id))
                ->orderByDesc('clicks_count')
                ->limit(4 - $related->count())->get();
            $related = $related->concat($more);
        }

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'related' => $related->values(),
        ]);
    }
}
