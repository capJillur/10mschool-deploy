<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Banners/Index', [
            'banners' => Banner::orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Banners/Form', ['banner' => null, 'accents' => Banner::ACCENTS]);
    }

    public function store(Request $request): RedirectResponse
    {
        $banner = Banner::create($this->payload($request));

        return redirect()->route('admin.banners.edit', $banner)->with('success', 'ব্যানার তৈরি হয়েছে।');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('Admin/Banners/Form', ['banner' => $banner, 'accents' => Banner::ACCENTS]);
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $banner->update($this->payload($request, $banner));

        return back()->with('success', 'ব্যানার সংরক্ষণ হয়েছে।');
    }

    public function toggle(Banner $banner): RedirectResponse
    {
        $banner->update(['is_active' => ! $banner->is_active]);

        return back();
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        if ($banner->isStoredLocally()) {
            Storage::disk('uploads')->delete($banner->image);
        }
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('success', 'ব্যানার মুছে ফেলা হয়েছে।');
    }

    private function payload(Request $request, ?Banner $existing = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'subtitle' => ['nullable', 'string', 'max:200'],
            'cta_label' => ['nullable', 'string', 'max:40'],
            'url' => ['required', 'string', 'max:2048', 'regex:#^(https?://|/)#'],
            'accent' => ['required', Rule::in(Banner::ACCENTS)],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65000'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_image' => ['boolean'],
        ], [], ['url' => 'লিংক', 'subtitle' => 'সাবটাইটেল', 'cta_label' => 'বাটনের লেখা', 'accent' => 'রং']);

        $payload = collect($data)->except(['image_url', 'image_file', 'remove_image'])->all();
        $payload['is_active'] = $request->boolean('is_active');
        $payload['sort_order'] = $data['sort_order'] ?? 0;

        if ($request->hasFile('image_file')) {
            $this->deleteStored($existing);
            $file = $request->file('image_file');
            $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'banner';
            $payload['image'] = $file->storeAs('banners', $name.'-'.Str::lower(Str::random(8)).'.'.$file->extension(), 'uploads');
        } elseif ($request->filled('image_url')) {
            $this->deleteStored($existing);
            $payload['image'] = $request->input('image_url');
        } elseif ($request->boolean('remove_image')) {
            $this->deleteStored($existing);
            $payload['image'] = null;
        }

        return $payload;
    }

    private function deleteStored(?Banner $banner): void
    {
        if ($banner?->isStoredLocally()) {
            Storage::disk('uploads')->delete($banner->image);
        }
    }
}
