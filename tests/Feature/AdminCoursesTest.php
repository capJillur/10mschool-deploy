<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCoursesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_course_with_an_uploaded_image(): void
    {
        Storage::fake('uploads');
        $admin = User::factory()->admin()->create();
        $category = Category::create(['group' => 'skills', 'name' => 'Language', 'slug' => 'language']);

        $response = $this->actingAs($admin)->post('/admin/courses', [
            'category_id' => $category->id,
            'title' => 'Spoken English',
            'instructor' => 'Munzereen Shahid',
            'affiliate_url' => 'https://10minuteschool.com/product/ghore-boshe-spoken-english/?ref=abc',
            'price' => 1950,
            'original_price' => 2500,
            'highlights' => "Line one\nLine two",
            'is_published' => '1',
            'image_file' => UploadedFile::fake()->image('thumb.jpg', 800, 450),
        ]);

        $course = Course::first();
        $response->assertRedirect("/admin/courses/{$course->id}/edit");
        $this->assertSame(['Line one', 'Line two'], $course->highlights);
        $this->assertSame(22, $course->discount_percent);
        Storage::disk('uploads')->assertExists($course->image);
    }

    public function test_admin_can_record_a_sale_with_default_commission(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::create(['group' => 'skills', 'name' => 'Language', 'slug' => 'language']);
        $course = Course::create(['category_id' => $category->id, 'title' => 'IELTS', 'affiliate_url' => 'https://example.com', 'price' => 3500]);

        $this->actingAs($admin)->post('/admin/sales', [
            'course_id' => $course->id,
            'amount' => 3500,
            'sold_at' => '2026-09-20',
        ])->assertRedirect();

        $this->assertSame(1, $course->fresh()->sales_count);
        $this->assertDatabaseHas('sales', ['course_id' => $course->id, 'commission' => 525]);
    }
}
