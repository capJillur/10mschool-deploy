<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::ordered()->withCount('courses')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->slug($data['name']);
        Category::create($data);

        return back()->with('success', 'ক্যাটাগরি যোগ হয়েছে।');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $this->validated($request, $category);
        $category->update($data);

        return back()->with('success', 'ক্যাটাগরি সংরক্ষণ হয়েছে।');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->courses()->exists()) {
            return back()->with('error', 'আগে এই ক্যাটাগরির কোর্সগুলো সরান বা মুছুন।');
        }
        $category->delete();

        return back()->with('success', 'ক্যাটাগরি মুছে ফেলা হয়েছে।');
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'group' => ['required', Rule::in(['academic', 'skills'])],
            'name' => ['required', 'string', 'max:80', Rule::unique('categories', 'name')->ignore($category?->id)],
            'tagline' => ['nullable', 'string', 'max:160'],
            'class_min' => ['nullable', 'integer', 'min:1', 'max:12'],
            'class_max' => ['nullable', 'integer', 'min:1', 'max:12', 'gte:class_min'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65000'],
        ]);
    }

    private function slug(string $name): string
    {
        $base = Str::slug($name) ?: 'category-'.Str::lower(Str::random(5));
        $slug = $base;
        $i = 2;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
