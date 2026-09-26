<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@10mschool.test'],
            ['name' => 'Admin', 'password' => 'password', 'is_admin' => true, 'email_verified_at' => now()],
        );

        $this->call([CatalogSeeder::class, BannerSeeder::class]);
    }
}
