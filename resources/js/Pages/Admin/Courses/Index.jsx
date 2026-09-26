import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MagnifyingGlass, PencilSimple, Star } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import CourseImage from '@/Components/CourseImage';
import { Select, inputClass } from '@/Components/Form';
import { number, priceLabel, cx, bn } from '@/lib/format';

function Switch({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={onChange}
            className={cx('relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-emerald-500' : 'bg-line-2')}
        >
            <span className={cx('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
        </button>
    );
}

export default function Index({ courses, categories, filters }) {
    const [q, setQ] = useState(filters.q || '');
    const first = useRef(true);

    const go = (patch) => {
        const next = { ...filters, ...patch };
        const query = {};
        Object.entries(next).forEach(([k, v]) => {
            if (v && !(k === 'sort' && v === 'clicks')) query[k] = v;
        });
        router.get('/admin/courses', query, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return undefined;
        }
        const t = setTimeout(() => {
            if ((q || '') !== (filters.q || '')) go({ q });
        }, 300);
        return () => clearTimeout(t);
    }, [q]);

    const toggle = (course, field) => router.patch(`/admin/courses/${course.id}/toggle`, { field }, { preserveScroll: true, preserveState: true });

    return (
        <AdminLayout title="কোর্স" actions={<Button href="/admin/courses/create" size="sm">কোর্স যোগ করুন</Button>}>
            <Head title="কোর্স" />

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
                <div className="relative">
                    <MagnifyingGlass size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                    <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="কোর্স খুঁজুন" aria-label="কোর্স খুঁজুন" className={cx(inputClass, 'pl-10')} />
                </div>
                <Select value={filters.category || ''} onChange={(e) => go({ category: e.target.value || null })} aria-label="ক্যাটাগরি">
                    <option value="">সব ক্যাটাগরি</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Select value={filters.status || ''} onChange={(e) => go({ status: e.target.value || null })} aria-label="স্ট্যাটাস">
                    <option value="">যেকোনো স্ট্যাটাস</option>
                    <option value="published">প্রকাশিত</option>
                    <option value="draft">লুকানো</option>
                    <option value="featured">ফিচার্ড</option>
                </Select>
                <Select value={filters.sort} onChange={(e) => go({ sort: e.target.value })} aria-label="সাজান">
                    <option value="clicks">সবচেয়ে বেশি ক্লিক</option>
                    <option value="sales">সবচেয়ে বেশি সেলস</option>
                    <option value="newest">নতুন</option>
                    <option value="title">নাম অনুযায়ী</option>
                </Select>
            </div>

            <div className="card-surface mt-5 overflow-hidden">
                <div className="hidden md:block">
                    <table className="w-full text-sm">
                        <thead className="border-b border-line bg-surface-3 text-left text-[13px] font-semibold text-ink-3">
                            <tr>
                                <th className="px-5 py-3">কোর্স</th>
                                <th className="px-3 py-3">ক্যাটাগরি</th>
                                <th className="px-3 py-3 text-right">দাম</th>
                                <th className="px-3 py-3 text-right">ক্লিক</th>
                                <th className="px-3 py-3 text-right">সেলস</th>
                                <th className="px-3 py-3 text-center">ফিচার্ড</th>
                                <th className="px-3 py-3 text-center">লাইভ</th>
                                <th className="px-5 py-3"><span className="sr-only">এডিট</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {courses.data.map((c) => (
                                <tr key={c.id} className={cx('hover:bg-surface-3/60', !c.is_published && 'opacity-60')}>
                                    <td className="px-5 py-3">
                                        <Link href={`/admin/courses/${c.id}/edit`} className="flex items-center gap-3">
                                            <CourseImage src={c.image_url} alt="" className="w-20 shrink-0 rounded-md" />
                                            <span className="min-w-0">
                                                <span className="line-clamp-2 font-semibold text-ink">{c.title}</span>
                                                {c.instructor && <span className="block truncate text-[12px] text-ink-3">{c.instructor}</span>}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="px-3 py-3 text-ink-2">{c.category?.name}</td>
                                    <td className="px-3 py-3 text-right font-semibold text-ink">{priceLabel(c)}</td>
                                    <td className="px-3 py-3 text-right text-ink-2">{number(c.clicks_count)}</td>
                                    <td className="px-3 py-3 text-right text-ink-2">{number(c.sales_count)}</td>
                                    <td className="px-3 py-3 text-center">
                                        <button type="button" onClick={() => toggle(c, 'is_featured')} aria-pressed={c.is_featured} aria-label="ফিচার্ড টগল" className={cx('rounded-full p-1.5 transition-colors', c.is_featured ? 'text-amber-500' : 'text-ink-3 hover:text-ink')}>
                                            <Star size={20} weight={c.is_featured ? 'fill' : 'regular'} />
                                        </button>
                                    </td>
                                    <td className="px-3 py-3 text-center"><Switch checked={c.is_published} onChange={() => toggle(c, 'is_published')} label="প্রকাশ টগল" /></td>
                                    <td className="px-5 py-3 text-right">
                                        <Link href={`/admin/courses/${c.id}/edit`} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-surface-3"><PencilSimple size={14} /> এডিট</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ul className="divide-y divide-line md:hidden">
                    {courses.data.map((c) => (
                        <li key={c.id} className={cx('p-4', !c.is_published && 'opacity-60')}>
                            <Link href={`/admin/courses/${c.id}/edit`} className="flex gap-3">
                                <CourseImage src={c.image_url} alt="" className="w-24 shrink-0 rounded-md" />
                                <span className="min-w-0">
                                    <span className="line-clamp-2 text-sm font-semibold text-ink">{c.title}</span>
                                    <span className="mt-0.5 block text-[12px] text-ink-3">{c.category?.name} · {priceLabel(c)}</span>
                                    <span className="mt-1 block text-[12px] text-ink-2">{number(c.clicks_count)} ক্লিক, {number(c.sales_count)} সেলস</span>
                                </span>
                            </Link>
                            <div className="mt-3 flex items-center gap-4">
                                <label className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                                    <Switch checked={c.is_published} onChange={() => toggle(c, 'is_published')} label="প্রকাশ টগল" /> লাইভ
                                </label>
                                <button type="button" onClick={() => toggle(c, 'is_featured')} className={cx('flex items-center gap-1 text-[13px] font-medium', c.is_featured ? 'text-amber-500' : 'text-ink-2')}>
                                    <Star size={18} weight={c.is_featured ? 'fill' : 'regular'} /> ফিচার্ড
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {courses.data.length === 0 && (
                    <div className="px-6 py-14 text-center">
                        <p className="text-sm font-semibold text-ink">কোনো কোর্স পাওয়া যায়নি</p>
                        <p className="mt-1 text-[13px] text-ink-2">ফিল্টার বদলান বা নতুন কোর্স যোগ করুন।</p>
                        <Button href="/admin/courses/create" size="sm" className="mt-4">কোর্স যোগ করুন</Button>
                    </div>
                )}

                {courses.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px] text-ink-2">
                        <span>{bn(courses.from)}-{bn(courses.to)} / {bn(courses.total)}</span>
                        <div className="flex gap-1">
                            {courses.prev_page_url && <Link href={courses.prev_page_url} preserveState className="rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-surface-3">আগের</Link>}
                            {courses.next_page_url && <Link href={courses.next_page_url} preserveState className="rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-surface-3">পরের</Link>}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
