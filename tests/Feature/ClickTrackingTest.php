<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClickTrackingTest extends TestCase
{
    use RefreshDatabase;

    private function course(): Course
    {
        $category = Category::create(['group' => 'skills', 'name' => 'Language', 'slug' => 'language']);

        return Course::create([
            'category_id' => $category->id,
            'title' => 'IELTS Course',
            'affiliate_url' => 'https://10minuteschool.com/product/ielts-course/?ref=abc',
            'price' => 3500,
        ]);
    }

    public function test_go_link_records_a_click_and_redirects(): void
    {
        $course = $this->course();

        $response = $this->get("/go/{$course->slug}");

        $response->assertRedirect($course->affiliate_url);
        $this->assertSame(1, $course->fresh()->clicks_count);
        $this->assertDatabaseCount('clicks', 1);
    }

    public function test_repeat_clicks_from_the_same_visitor_are_not_double_counted(): void
    {
        $course = $this->course();

        $this->get("/go/{$course->slug}");
        $this->get("/go/{$course->slug}");

        $this->assertSame(1, $course->fresh()->clicks_count);
    }

    public function test_unpublished_course_cannot_be_clicked(): void
    {
        $course = $this->course();
        $course->update(['is_published' => false]);

        $this->get("/go/{$course->slug}")->assertNotFound();
    }
}
