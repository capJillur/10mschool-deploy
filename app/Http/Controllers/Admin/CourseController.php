<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseRequest;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'category' => $request->integer('category') ?: null,
            'status' => in_array($request->query('status'), ['published', 'draft', 'featured']) ? $request->query('status') : null,
            'sort' => in_array($request->query('sort'), ['clicks', 'sales', 'newest', 'title']) ? $request->query('sort') : 'clicks',
        ];

        $query = Course::with('category:id,name,group')->search($filters['q']);

        if ($filters['category']) {
            $query->where('category_id', $filters['category']);
        }
        match ($filters['status']) {
            'published' => $query->where('is_published', true),
            'draft' => $query->where('is_published', false),
            'featured' => $query->where('is_featured', true),
            default => null,
        };
        match ($filters['sort']) {
            'sales' => $query->orderByDesc('sales_count')->orderByDesc('clicks_count'),
            'newest' => $query->orderByDesc('id'),
            'title' => $query->orderBy('title'),
            default => $query->orderByDesc('clicks_count')->orderByDesc('id'),
        };

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $query->paginate(20)->withQueryString(),
            'categories' => Category::ordered()->get(['id', 'name', 'group']),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Courses/Form', [
            'course' => null,
            'categories' => Category::ordered()->get(['id', 'name', 'group']),
        ]);
    }

    public function store(CourseRequest $request): RedirectResponse
    {
        $data = $this->payload($request);
        $course = Course::create($data);

        return redirect()->route('admin.courses.edit', $course)->with('success', 'কোর্স তৈরি হয়েছে।');
    }

    public function edit(Course $course): Response
    {
        $course->loadCount('clicks');

        return Inertia::render('Admin/Courses/Form', [
            'course' => $course,
            'categories' => Category::ordered()->get(['id', 'name', 'group']),
        ]);
    }

    public function update(CourseRequest $request, Course $course): RedirectResponse
    {
        $data = $this->payload($request, $course);
        $course->update($data);

        return back()->with('success', 'কোর্স সংরক্ষণ হয়েছে।');
    }

    public function toggle(Request $request, Course $course): RedirectResponse
    {
        $field = $request->input('field') === 'is_featured' ? 'is_featured' : 'is_published';
        $course->update([$field => ! $course->{$field}]);

        return back();
    }

    public function destroy(Course $course): RedirectResponse
    {
        $this->deleteStoredImage($course);
        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'কোর্স মুছে ফেলা হয়েছে।');
    }

    private function payload(CourseRequest $request, ?Course $existing = null): array
    {
        $data = $request->safe()->except(['image_url', 'image_file', 'remove_image']);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        if ($request->hasFile('image_file')) {
            if ($existing) {
                $this->deleteStoredImage($existing);
            }
            $file = $request->file('image_file');
            $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'course';
            $data['image'] = $file->storeAs('courses', $name.'-'.Str::lower(Str::random(8)).'.'.$file->extension(), 'uploads');
        } elseif ($request->filled('image_url')) {
            if ($existing) {
                $this->deleteStoredImage($existing);
            }
            $data['image'] = $request->input('image_url');
        } elseif ($request->boolean('remove_image')) {
            if ($existing) {
                $this->deleteStoredImage($existing);
            }
            $data['image'] = null;
        }

        return $data;
    }

    private function deleteStoredImage(Course $course): void
    {
        if ($course->image && ! Str::startsWith($course->image, ['http://', 'https://', '/'])) {
            Storage::disk('uploads')->delete($course->image);
        }
    }
}
