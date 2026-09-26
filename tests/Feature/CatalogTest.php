<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(array $overrides = []): Course
    {
        $category = Category::create(['group' => 'skills', 'name' => 'Language', 'slug' => 'language']);

        return Course::create(array_merge([
            'category_id' => $category->id,
            'title' => 'IELTS Course',
            'affiliate_url' => 'https://10minuteschool.com/product/ielts-course/?ref=abc',
            'price' => 3500,
        ], $overrides));
    }

    public function test_home_and_catalog_render(): void
    {
        $this->makeCourse();

        $this->get('/')->assertOk();
        $this->get('/courses')->assertOk();
        $this->get('/courses?q=ielts&group=skills&sort=newest')->assertOk();
    }

    public function test_course_page_renders_and_unpublished_is_hidden(): void
    {
        $course = $this->makeCourse();
        $this->get("/courses/{$course->slug}")->assertOk();

        $course->update(['is_published' => false]);
        $this->get("/courses/{$course->slug}")->assertNotFound();
    }

    public function test_slug_is_generated_from_title(): void
    {
        $course = $this->makeCourse();

        $this->assertSame('ielts-course', $course->slug);
    }
}
