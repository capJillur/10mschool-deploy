<?php

namespace App\Http\Controllers;

use App\Models\Click;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoController extends Controller
{
    /**
     * Record an outbound click and send the visitor to the 10 Minute School page.
     * The same visitor clicking the same course again within 30 minutes is not counted twice.
     */
    public function __invoke(Request $request, Course $course): RedirectResponse
    {
        abort_unless($course->is_published, 404);

        $ipHash = hash('sha256', $request->ip().'|'.config('app.key'));

        $alreadyCounted = Click::query()
            ->where('course_id', $course->id)
            ->where('ip_hash', $ipHash)
            ->where('created_at', '>=', now()->subMinutes(30))
            ->exists();

        if (! $alreadyCounted) {
            Click::create([
                'course_id' => $course->id,
                'ip_hash' => $ipHash,
                'user_agent' => Str::limit((string) $request->userAgent(), 500, ''),
                'referer' => Str::limit((string) $request->headers->get('referer'), 2000, ''),
            ]);
            $course->increment('clicks_count');
        }

        return redirect()->away($course->affiliate_url);
    }
}
