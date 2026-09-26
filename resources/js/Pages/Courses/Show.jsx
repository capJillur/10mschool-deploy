import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, CaretRight, Check, ShieldCheck } from '@phosphor-icons/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Button from '@/Components/Button';
import CourseCard from '@/Components/CourseCard';
import CourseImage from '@/Components/CourseImage';
import Reveal from '@/Components/Reveal';
import { priceLabel, taka, cx, isFree, bn } from '@/lib/format';

export default function Show({ course, related }) {
    const goUrl = route('go', course.slug);
    const free = isFree(course);
    const paragraphs = (course.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const groupHref = `/courses?group=${course.category?.group}`;

    const priceBlock = (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={cx('font-display text-3xl font-extrabold', free ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink')}>{priceLabel(course)}</span>
            {course.discount_percent && (
                <>
                    <span className="text-base text-ink-3 line-through">{taka(course.original_price)}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[13px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{bn(course.discount_percent)}% ছাড়</span>
                </>
            )}
        </div>
    );

    return (
        <PublicLayout>
            <Head title={course.title}>
                {course.description && <meta name="description" content={course.description.slice(0, 155)} />}
            </Head>

            <div className="container-x pt-6 sm:pt-10">
                <nav className="flex flex-wrap items-center gap-1.5 text-[14px] text-ink-2" aria-label="ব্রেডক্রাম্ব">
                    <Link href="/" className="hover:text-ink">হোম</Link>
                    <CaretRight size={12} />
                    <Link href={groupHref} className="hover:text-ink">{course.category?.group === 'academic' ? 'একাডেমিক' : 'স্কিলস'}</Link>
                    <CaretRight size={12} />
                    <Link href={`/courses?category=${course.category?.slug}`} className="hover:text-ink">{course.category?.name}</Link>
                </nav>

                <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-7">
                        <div className="lg:hidden">
                            <CourseImage src={course.image_url} alt={course.title} priority className="rounded-card border border-line" />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2 text-[14px] font-medium text-ink-2 lg:mt-0">
                            <span>{course.category?.name}</span>
                            {course.badge && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">{course.badge}</span>}
                        </div>
                        <h1 className="mt-3 text-balance text-3xl font-extrabold text-ink sm:text-4xl">{course.title}</h1>
                        {course.instructor && <p className="mt-3 text-base text-ink-2">ইন্সট্রাক্টর: <span className="font-semibold text-ink">{course.instructor}</span></p>}

                        {paragraphs.length > 0 && (
                            <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-ink-2 sm:text-base">
                                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        )}

                        {course.highlights?.length > 0 && (
                            <div className="mt-10">
                                <h2 className="text-xl font-bold text-ink">এই কোর্সে যা পাবেন</h2>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {course.highlights.map((h) => (
                                        <li key={h} className="flex items-start gap-3 rounded-xl bg-surface-3 px-4 py-3 text-[15px] text-ink">
                                            <Check size={18} weight="bold" className="mt-1 shrink-0 text-brand-600" />
                                            <span>{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-10 flex gap-4 rounded-card border border-line p-5">
                            <ShieldCheck size={26} weight="duotone" className="shrink-0 text-brand-600" />
                            <div className="text-[15px] leading-relaxed text-ink-2">
                                <p className="font-semibold text-ink">ভর্তি হবে 10minuteschool.com-এ</p>
                                <p className="mt-1">বাটনে ক্লিক করলে অফিসিয়াল কোর্স পেজে যাবেন। পেমেন্ট সরাসরি টেন মিনিট স্কুলকে, আর পাবেন একই কোর্স, সাপোর্ট ও সার্টিফিকেট। এতে আমরা কমিশন পেতে পারি।</p>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-5">
                        <div className="card-surface overflow-hidden lg:sticky lg:top-24">
                            <div className="hidden lg:block">
                                <CourseImage src={course.image_url} alt="" priority className="rounded-t-[15px]" />
                            </div>
                            <div className="p-5 sm:p-6">
                                {priceBlock}
                                <Button as="a" href={goUrl} size="lg" className="mt-5 w-full" rel="nofollow sponsored">
                                    টেন মিনিট স্কুলে ভর্তি হন <ArrowUpRight size={18} weight="bold" />
                                </Button>
                                <p className="mt-3 text-center text-[13px] text-ink-3">অফিসিয়াল কোর্স পেজ খুলবে</p>
                            </div>
                        </div>
                    </aside>
                </div>

                {related.length > 0 && (
                    <section className="mt-20 sm:mt-28">
                        <Reveal>
                            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">এই ধরনের আরও কোর্স</h2>
                        </Reveal>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                            {related.map((c, i) => (
                                <Reveal key={c.id} delay={i * 0.06}>
                                    <CourseCard course={c} />
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 p-3 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className={cx('font-display text-lg font-extrabold', free ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink')}>{priceLabel(course)}</p>
                        {course.discount_percent && <p className="text-[13px] text-ink-3 line-through">{taka(course.original_price)}</p>}
                    </div>
                    <Button as="a" href={goUrl} rel="nofollow sponsored">টেন মিনিট স্কুলে ভর্তি হন</Button>
                </div>
            </div>
            <div className="h-20 lg:hidden" aria-hidden="true" />
        </PublicLayout>
    );
}
