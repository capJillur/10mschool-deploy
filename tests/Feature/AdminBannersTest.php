<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminBannersTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_and_toggle_a_banner(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/banners', [
            'title' => 'ঘরে বসেই ক্লাস',
            'subtitle' => 'লাইভ ক্লাস',
            'cta_label' => 'দেখুন',
            'url' => '/courses?group=academic',
            'accent' => 'sky',
            'is_active' => '1',
            'image_url' => 'https://cdn.10minuteschool.com/images/thumbnails/IELTS_new_16_9.png',
        ])->assertRedirect();

        $banner = Banner::first();
        $this->assertSame('sky', $banner->accent);
        $this->assertTrue($banner->is_active);

        $this->actingAs($admin)->patch("/admin/banners/{$banner->id}/toggle")->assertRedirect();
        $this->assertFalse($banner->fresh()->is_active);
    }

    public function test_home_renders_only_active_banners(): void
    {
        Banner::create(['title' => 'A', 'url' => '/courses', 'accent' => 'rose', 'is_active' => true]);
        Banner::create(['title' => 'B', 'url' => '/courses', 'accent' => 'rose', 'is_active' => false]);

        $this->get('/')->assertOk()->assertInertia(fn ($page) => $page->component('Home')->has('banners', 1));
    }
}
