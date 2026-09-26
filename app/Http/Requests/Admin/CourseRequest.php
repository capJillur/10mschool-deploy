<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        $highlights = $this->input('highlights');
        if (is_string($highlights)) {
            $highlights = collect(preg_split('/\r\n|\r|\n/', $highlights))
                ->map(fn ($l) => trim($l))
                ->filter()
                ->values()
                ->all();
        }

        $this->merge([
            'highlights' => $highlights ?: [],
            'is_free' => $this->boolean('is_free'),
            'is_featured' => $this->boolean('is_featured'),
            'is_published' => $this->boolean('is_published'),
            'price' => $this->filled('price') ? $this->input('price') : null,
            'original_price' => $this->filled('original_price') ? $this->input('original_price') : null,
        ]);
    }

    public function rules(): array
    {
        $courseId = $this->route('course')?->id;

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:160', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('courses', 'slug')->ignore($courseId)],
            'instructor' => ['nullable', 'string', 'max:120'],
            'badge' => ['nullable', 'string', 'max:40'],
            'description' => ['nullable', 'string', 'max:5000'],
            'highlights' => ['array', 'max:12'],
            'highlights.*' => ['string', 'max:160'],
            'affiliate_url' => ['required', 'url', 'max:2048'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:999999'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999'],
            'is_free' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65000'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_image' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'category',
            'affiliate_url' => 'affiliate link',
            'image_file' => 'image',
        ];
    }
}
