<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public const DEFAULT_COMMISSION_RATE = 0.15;

    public function index(): Response
    {
        return Inertia::render('Admin/Sales/Index', [
            'sales' => Sale::with('course:id,title,slug,image')->latest('sold_at')->latest('id')->paginate(25),
            'courses' => Course::orderBy('title')->get(['id', 'title', 'price']),
            'totals' => [
                'count' => Sale::count(),
                'amount' => (float) Sale::sum('amount'),
                'commission' => (float) Sale::sum('commission'),
            ],
            'defaultRate' => self::DEFAULT_COMMISSION_RATE,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'amount' => ['required', 'numeric', 'min:0', 'max:999999'],
            'commission' => ['nullable', 'numeric', 'min:0', 'max:999999'],
            'sold_at' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        if (! isset($data['commission']) || $data['commission'] === '') {
            $data['commission'] = round($data['amount'] * self::DEFAULT_COMMISSION_RATE, 2);
        }

        $sale = Sale::create($data);
        $sale->course()->increment('sales_count');

        return back()->with('success', 'সেল রেকর্ড হয়েছে।');
    }

    public function destroy(Sale $sale): RedirectResponse
    {
        $course = $sale->course;
        $sale->delete();
        if ($course && $course->sales_count > 0) {
            $course->decrement('sales_count');
        }

        return back()->with('success', 'সেল মুছে ফেলা হয়েছে।');
    }
}
