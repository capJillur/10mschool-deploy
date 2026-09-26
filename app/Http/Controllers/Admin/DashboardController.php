<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Click;
use App\Models\Course;
use App\Models\Sale;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = Carbon::today();
        $last7 = $today->copy()->subDays(6);
        $prev7Start = $today->copy()->subDays(13);
        $last30 = $today->copy()->subDays(29);

        $clicksLast7 = Click::where('created_at', '>=', $last7)->count();
        $clicksPrev7 = Click::whereBetween('created_at', [$prev7Start, $last7])->count();

        $daily = Click::query()
            ->selectRaw('date(created_at) as day, count(*) as total')
            ->where('created_at', '>=', $last30)
            ->groupBy('day')
            ->pluck('total', 'day');

        $series = collect(range(0, 29))->map(function ($i) use ($last30, $daily) {
            $day = $last30->copy()->addDays($i)->toDateString();

            return ['day' => $day, 'clicks' => (int) ($daily[$day] ?? 0)];
        });

        $topCourses = Course::query()
            ->select('courses.id', 'courses.title', 'courses.slug', 'courses.image', 'courses.sales_count', 'courses.clicks_count')
            ->selectSub(
                Click::selectRaw('count(*)')->whereColumn('clicks.course_id', 'courses.id')->where('created_at', '>=', $last30),
                'clicks_30d'
            )
            ->orderByDesc('clicks_30d')->orderByDesc('clicks_count')
            ->limit(6)->get();

        $recentClicks = Click::with('course:id,title,slug')
            ->latest('id')->limit(10)->get()
            ->map(fn (Click $c) => [
                'id' => $c->id,
                'course' => $c->course?->title,
                'course_id' => $c->course_id,
                'referer' => $c->referer ? parse_url($c->referer, PHP_URL_HOST) : null,
                'at' => $c->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'clicks_total' => Click::count(),
                'clicks_7d' => $clicksLast7,
                'clicks_prev_7d' => $clicksPrev7,
                'clicks_today' => Click::where('created_at', '>=', $today)->count(),
                'sales_total' => Sale::count(),
                'sales_30d' => Sale::where('sold_at', '>=', $last30)->count(),
                'commission_total' => (float) Sale::sum('commission'),
                'commission_30d' => (float) Sale::where('sold_at', '>=', $last30)->sum('commission'),
                'courses_published' => Course::published()->count(),
                'courses_total' => Course::count(),
            ],
            'series' => $series,
            'topCourses' => $topCourses,
            'recentClicks' => $recentClicks,
        ]);
    }
}
