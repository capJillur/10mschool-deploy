import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { CaretLeft, CaretRight, FunnelSimple, MagnifyingGlass, X } from '@phosphor-icons/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Button from '@/Components/Button';
import CourseCard from '@/Components/CourseCard';
import CourseCardSkeleton from '@/Components/CourseCardSkeleton';
import { number, bn, cx } from '@/lib/format';

const SORTS = [
    { value: 'popular', label: 'জনপ্রিয়' },
    { value: 'newest', label: 'নতুন' },
    { value: 'price_asc', label: 'দাম: কম থেকে বেশি' },
    { value: 'price_desc', label: 'দাম: বেশি থেকে কম' },
];

function buildQuery(filters, patch) {
    const next = { ...filters, ...patch };
    const q = {};
    if (next.q) q.q = next.q;
    if (next.category) q.category = next.category;
    else if (next.class) q.class = next.class;
    else if (next.group) q.group = next.group;
    if (next.free) q.free = 1;
    if (next.sort && next.sort !== 'popular') q.sort = next.sort;
    return q;
}

function useLoading() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const off1 = router.on('start', (e) => {
            if (e.detail.visit.url.pathname === '/courses') setLoading(true);
        });
        const off2 = router.on('finish', () => setLoading(false));
        return () => {
            off1();
            off2();
        };
    }, []);
    return loading;
}

function CategoryList({ title, items, filters, go }) {
    return (
        <div>
            <p className="mb-2 text-[13px] font-bold text-ink-3">{title}</p>
            <ul className="space-y-0.5">
                {items.map((cat) => {
                    const active = filters.category === cat.slug;
                    return (
                        <li key={cat.id}>
                            <button
                                type="button"
                                onClick={() => go({ category: active ? null : cat.slug, class: null, group: active ? null : cat.group })}
                                className={cx(
                                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[15px] transition-colors',
                                    active ? 'bg-ink font-semibold text-surface' : 'text-ink-2 hover:bg-surface-3 hover:text-ink',
                                )}
                            >
                                <span className="truncate">{cat.name}</span>
                                <span className={cx('ml-2 text-[13px]', active ? 'text-surface/70' : 'text-ink-3')}>{number(cat.published_courses_count)}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function Index({ courses, categories, filters, activeCategory }) {
    const loading = useLoading();
    const [q, setQ] = useState(filters.q || '');
    const [drawer, setDrawer] = useState(false);
    const first = useRef(true);

    const go = (patch, opts = {}) =>
        router.get('/courses', buildQuery(filters, patch), { preserveState: true, preserveScroll: true, replace: true, ...opts });

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return undefined;
        }
        const t = setTimeout(() => {
            if ((q || '') !== (filters.q || '')) go({ q });
        }, 350);
        return () => clearTimeout(t);
    }, [q]);

    useEffect(() => setDrawer(false), [courses]);

    const academic = useMemo(() => categories.filter((c) => c.group === 'academic'), [categories]);
    const skills = useMemo(() => categories.filter((c) => c.group === 'skills'), [categories]);

    const title = activeCategory
        ? activeCategory.name
        : filters.class
          ? `ক্লাস ${bn(filters.class)}`
          : filters.group === 'academic'
            ? 'একাডেমিক কোর্স'
            : filters.group === 'skills'
              ? 'স্কিল কোর্স'
              : filters.free
                ? 'ফ্রি কোর্স'
                : filters.q
                  ? `"${filters.q}" এর ফলাফল`
                  : 'সব কোর্স';

    const hasFilters = filters.q || filters.category || filters.class || filters.group || filters.free;
    const chips = [
        filters.category && { label: activeCategory?.name || filters.category, clear: { category: null, group: null } },
        !filters.category && filters.class && { label: `ক্লাস ${bn(filters.class)}`, clear: { class: null, group: null } },
        !filters.category && !filters.class && filters.group && { label: filters.group === 'academic' ? 'একাডেমিক' : 'স্কিলস', clear: { group: null } },
        filters.free && { label: 'শুধু ফ্রি', clear: { free: false } },
    ].filter(Boolean);

    const sidebar = (
        <div className="space-y-6">
            <div className="flex gap-1 rounded-full bg-surface-3 p-1">
                {[
                    { value: null, label: 'সব' },
                    { value: 'academic', label: 'একাডেমিক' },
                    { value: 'skills', label: 'স্কিলস' },
                ].map((g) => {
                    const active = (filters.group || null) === g.value && !filters.category && !filters.class;
                    return (
                        <button
                            key={g.label}
                            type="button"
                            onClick={() => go({ group: g.value, category: null, class: null })}
                            className={cx('flex-1 rounded-full py-1.5 text-[15px] font-semibold transition-colors', active ? 'bg-surface-2 text-ink shadow-card' : 'text-ink-2 hover:text-ink')}
                        >
                            {g.label}
                        </button>
                    );
                })}
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-3 py-2.5 text-[15px] font-semibold text-ink">
                শুধু ফ্রি কোর্স
                <input type="checkbox" checked={!!filters.free} onChange={(e) => go({ free: e.target.checked })} className="h-4 w-4 accent-brand-600" />
            </label>
            <CategoryList title="একাডেমিক" items={academic} filters={filters} go={go} />
            <CategoryList title="স্কিলস" items={skills} filters={filters} go={go} />
        </div>
    );

    return (
        <PublicLayout>
            <Head title={title} />
            <div className="container-x pt-8 sm:pt-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
                        <p className="mt-2 text-[15px] text-ink-2">
                            {activeCategory?.tagline || `${number(courses.total)}টি কোর্স`}
                        </p>
                    </div>
                    {hasFilters && (
                        <Link href="/courses" className="text-[15px] font-semibold text-ink-2 hover:text-ink">সব মুছুন</Link>
                    )}
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">{sidebar}</div>
                    </aside>

                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <MagnifyingGlass size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                                <label htmlFor="catalog-search" className="sr-only">কোর্স খুঁজুন</label>
                                <input
                                    id="catalog-search"
                                    type="search"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="কোর্স বা ইন্সট্রাক্টরের নাম লিখুন"
                                    className="h-11 w-full rounded-full border border-line bg-surface-2 pl-10 pr-4 text-[15px] text-ink placeholder:text-ink-3 focus:border-ink-3 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <label className="sr-only" htmlFor="sort">সাজান</label>
                                <select
                                    id="sort"
                                    value={filters.sort}
                                    onChange={(e) => go({ sort: e.target.value })}
                                    className="h-11 flex-1 rounded-full border border-line bg-surface-2 px-4 text-[15px] font-medium text-ink focus:border-ink-3 focus:outline-none sm:flex-none"
                                >
                                    {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                                <Button variant="secondary" className="lg:hidden" onClick={() => setDrawer(true)}>
                                    <FunnelSimple size={18} /> ফিল্টার
                                </Button>
                            </div>
                        </div>

                        {chips.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {chips.map((chip) => (
                                    <button key={chip.label} type="button" onClick={() => go(chip.clear)} className="inline-flex items-center gap-1.5 rounded-full bg-surface-3 py-1.5 pl-3 pr-2 text-[14px] font-semibold text-ink hover:bg-line">
                                        {chip.label} <X size={13} weight="bold" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3" aria-busy={loading}>
                            {loading
                                ? Array.from({ length: 6 }, (_, i) => <CourseCardSkeleton key={i} />)
                                : courses.data.map((course, i) => <CourseCard key={course.id} course={course} priority={i < 3} />)}
                        </div>

                        {!loading && courses.data.length === 0 && (
                            <div className="rounded-card border border-dashed border-line-2 px-6 py-16 text-center">
                                <p className="text-lg font-bold text-ink">এমন কোনো কোর্স পাওয়া যায়নি</p>
                                <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-2">অন্য কিছু লিখে খুঁজুন, অথবা ফিল্টার মুছে সব কোর্স দেখুন।</p>
                                <Button href="/courses" variant="secondary" className="mt-6">সব কোর্স দেখুন</Button>
                            </div>
                        )}

                        {courses.last_page > 1 && (
                            <nav className="mt-10 flex items-center justify-center gap-1" aria-label="পেজ">
                                <PageLink link={courses.links[0]} icon={<CaretLeft size={16} weight="bold" />} label="আগের পেজ" />
                                {courses.links.slice(1, -1).map((link) => (
                                    <PageLink key={link.label} link={link} label={bn(link.label)} />
                                ))}
                                <PageLink link={courses.links[courses.links.length - 1]} icon={<CaretRight size={16} weight="bold" />} label="পরের পেজ" />
                            </nav>
                        )}
                    </div>
                </div>
            </div>

            {drawer && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} aria-label="ফিল্টার বন্ধ করুন" />
                    <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-band bg-surface p-5 shadow-pop">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-lg font-bold text-ink">ফিল্টার</p>
                            <button type="button" onClick={() => setDrawer(false)} className="rounded-full p-2 text-ink-2 hover:bg-surface-3" aria-label="ফিল্টার বন্ধ করুন"><X size={20} /></button>
                        </div>
                        {sidebar}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

function PageLink({ link, icon, label }) {
    const content = icon || <span>{label}</span>;
    const cls = cx(
        'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[15px] font-semibold transition-colors',
        link.active ? 'bg-ink text-surface' : link.url ? 'text-ink-2 hover:bg-surface-3 hover:text-ink' : 'text-ink-3 opacity-50',
    );
    if (!link.url) return <span className={cls} aria-disabled="true">{content}</span>;
    return (
        <Link href={link.url} className={cls} preserveScroll={false} aria-label={icon ? label : undefined} aria-current={link.active ? 'page' : undefined}>
            {content}
        </Link>
    );
}
