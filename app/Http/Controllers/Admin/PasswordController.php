<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Password');
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ], [
            'current_password.current_password' => 'বর্তমান পাসওয়ার্ড সঠিক নয়।',
            'password.confirmed' => 'নতুন পাসওয়ার্ড দুইবার একই লিখুন।',
            'password.min' => 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
        ], ['current_password' => 'বর্তমান পাসওয়ার্ড', 'password' => 'নতুন পাসওয়ার্ড']);

        $request->user()->update(['password' => $data['password']]);

        return back()->with('success', 'পাসওয়ার্ড বদলানো হয়েছে।');
    }
}
