<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SetupAndPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_setup_route_is_hidden_without_a_token(): void
    {
        config(['app.setup_token' => null]);
        $this->get('/setup/anything')->assertNotFound();

        config(['app.setup_token' => 'secret-token']);
        $this->get('/setup/wrong')->assertNotFound();
    }

    public function test_setup_route_seeds_when_no_admin_exists(): void
    {
        config(['app.setup_token' => 'secret-token']);

        $this->get('/setup/secret-token')->assertOk()->assertSee('DONE');

        $this->assertTrue(User::where('is_admin', true)->exists());
        $this->assertDatabaseCount('banners', 4);
    }

    public function test_admin_can_change_password(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->put('/admin/password', [
            'current_password' => 'password',
            'password' => 'new-strong-pass',
            'password_confirmation' => 'new-strong-pass',
        ])->assertRedirect();

        $this->assertTrue(Hash::check('new-strong-pass', $admin->fresh()->password));
    }
}
