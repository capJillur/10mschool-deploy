import { Head, Link, router } from '@inertiajs/react';
import { PencilSimple } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import CourseImage from '@/Components/CourseImage';
import { TINTS } from '@/lib/tints';
import { number, cx } from '@/lib/format';

function Switch({ checked, onChange, label }) {
    return (
        <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={cx('relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-emerald-500' : 'bg-line-2')}>
            <span className={cx('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
        </button>
    );
}

export default function Index({ banners }) {
    const toggle = (b) => router.patch(`/admin/banners/${b.id}/toggle`, {}, { preserveScroll: true, preserveState: true });

    return (
        <AdminLayout title="ব্যানার" actions={<Button href="/admin/banners/create" size="sm">ব্যানার যোগ করুন</Button>}>
            <Head title="ব্যানার" />
            <p className="max-w-2xl text-[15px] text-ink-2">ল্যান্ডিং পেজের একদম উপরে এই ব্যানারগুলো স্লাইডশো হিসেবে দেখা যায়। ছোট ক্রম আগে আসে। কোনো ব্যানার চালু না থাকলে সাধারণ হিরো দেখানো হয়।</p>

            <ul className="mt-5 grid gap-4 md:grid-cols-2">
                {banners.map((b) => {
                    const tint = TINTS[b.accent] || TINTS.rose;
                    return (
                        <li key={b.id} className={cx('card-surface flex gap-4 p-4', !b.is_active && 'opacity-60')}>
                            <div className={cx('w-36 shrink-0 overflow-hidden rounded-lg p-2', tint.bg)}>
                                <CourseImage src={b.image_url} alt="" className="w-full rounded-md" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="line-clamp-2 font-bold text-ink">{b.title}</p>
                                        {b.subtitle && <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-2">{b.subtitle}</p>}
                                    </div>
                                    <span className={cx('shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold', tint.bg, tint.ink)}>{tint.label}</span>
                                </div>
                                <p className="mt-2 truncate text-[12px] text-ink-3">{b.url}</p>
                                <div className="mt-3 flex items-center gap-3">
                                    <label className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                                        <Switch checked={b.is_active} onChange={() => toggle(b)} label="চালু টগল" /> চালু
                                    </label>
                                    <span className="text-[12px] text-ink-3">ক্রম {number(b.sort_order)}</span>
                                    <Link href={`/admin/banners/${b.id}/edit`} className="ml-auto inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-surface-3"><PencilSimple size={14} /> এডিট</Link>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {banners.length === 0 && (
                <div className="card-surface mt-5 px-6 py-14 text-center">
                    <p className="text-sm font-semibold text-ink">এখনো কোনো ব্যানার নেই</p>
                    <p className="mt-1 text-[13px] text-ink-2">প্রথম ব্যানার যোগ করলেই ল্যান্ডিং পেজে স্লাইডশো দেখা যাবে।</p>
                    <Button href="/admin/banners/create" size="sm" className="mt-4">ব্যানার যোগ করুন</Button>
                </div>
            )}
        </AdminLayout>
    );
}
