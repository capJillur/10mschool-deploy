<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

/**
 * One-time installer for shared hosting without a terminal.
 * Enabled only while SETUP_TOKEN is set in .env. Remove the token when done.
 */
class SetupController extends Controller
{
    public function __invoke(Request $request, string $token): Response
    {
        $expected = (string) config('app.setup_token');
        abort_if($expected === '' || ! hash_equals($expected, $token), 404);

        $lines = [];

        if (blank(config('app.key'))) {
            $key = 'base64:'.base64_encode(random_bytes(32));
            $this->writeEnv('APP_KEY', $key);
            config(['app.key' => $key]);
            $lines[] = 'APP_KEY generated and written to .env';
        } else {
            $lines[] = 'APP_KEY already set';
        }

        Artisan::call('migrate', ['--force' => true]);
        $lines[] = trim(Artisan::output()) ?: 'Migrations: nothing to do';

        if (! \App\Models\User::where('is_admin', true)->exists()) {
            Artisan::call('db:seed', ['--force' => true]);
            $lines[] = 'Seeded categories, courses, banners and the admin user (admin@10mschool.test / password)';
        } else {
            $lines[] = 'Seed skipped: an admin user already exists';
        }

        Artisan::call('optimize:clear');
        $lines[] = 'Caches cleared';

        $lines[] = '';
        $lines[] = 'DONE. Now open .env and delete the SETUP_TOKEN line, then sign in at /login and change the admin password.';

        return response(implode(PHP_EOL, $lines), 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    private function writeEnv(string $key, string $value): void
    {
        $path = app()->environmentFilePath();
        $contents = file_get_contents($path);
        $line = $key.'='.$value;
        if (preg_match('/^'.preg_quote($key, '/').'=.*$/m', $contents)) {
            $contents = preg_replace('/^'.preg_quote($key, '/').'=.*$/m', $line, $contents);
        } else {
            $contents = rtrim($contents).PHP_EOL.$line.PHP_EOL;
        }
        file_put_contents($path, $contents);
        if (Str::contains($contents, $line) === false) {
            throw new \RuntimeException('Could not write .env');
        }
    }
}
