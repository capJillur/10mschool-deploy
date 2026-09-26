import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CaretRight, ChalkboardTeacher, ChatsCircle, PlayCircle, UsersThree } from '@phosphor-icons/react';
import PublicLayout from '@/Layouts/PublicLayout';
import BannerCarousel from '@/Components/BannerCarousel';
import Button from '@/Components/Button';
import CourseCard from '@/Components/CourseCard';
import CourseImage from '@/Components/CourseImage';
import Rail, { RailArrows, useRail } from '@/Components/Rail';
import Reveal from '@/Components/Reveal';
import { number, priceLabel, taka, bn, cx } from '@/lib/format';

const ease = [0.16, 1, 0.3, 1];

function SectionHeader({ title, text, href, linkLabel }) {
    return (
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-ink sm:text-[1.75rem]">{title}</h2>
                {text && <p className="mt-1.5 max-w-lg text-[15px] text-ink-2">{text}</p>}
            </div>
            {href && (
                <Link href={href} className="inline-flex items-center gap-1 text-[15px] font-semibold text-brand-600 hover:text-brand-700">
                    {linkLabel} <CaretRight size={14} weight="bold" />
                </Link>
            )}
        </Reveal>
    );
}

/* Shown only while no banner is active. */
function HeroFallback({ course }) {
    const reduce = useReducedMotion();
    return (
        <section className="container-x grid items-center gap-8 pb-4 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-16">
            <div className="lg:col-span-6">
                <motion.h1 initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease }} className="text-balance text-3xl font-bold text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.3]">
                    টেন মিনিট স্কুলের সেরা কোর্সটি খুঁজে নিন
                </motion.h1>
                <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }} className="mt-4 max-w-lg text-base leading-relaxed text-ink-2 sm:text-lg">
                    ক্লাস ১-১২ এর একাডেমিক ব্যাচ আর দেশসেরা স্কিল কোর্স, সব এক জায়গায়।
                </motion.p>
                <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease }} className="mt-7 flex flex-wrap gap-3">
                    <Button href="/courses" size="lg">সব কোর্স দেখুন</Button>
                    <Button href="/courses?group=academic" variant="secondary" size="lg">একাডেমিক কোর্স</Button>
                </motion.div>
            </div>
            {course && (
                <div className="lg:col-span-6">
                    <Link href={route('courses.show', course.slug)} className="block overflow-hidden rounded-card border border-line bg-surface-2 shadow-card-hover">
                        <CourseImage src={course.image_url} alt={course.title} priority />
                    </Link>
                </div>
            )}
        </section>
    );
}

/* Facts published on 10minuteschool.com. */
function TrustStrip() {
    const items = [
        { icon: UsersThree, title: '১ কোটি ৭০ লাখ+ শিক্ষার্থী', body: 'দেশের সবচেয়ে বড় অনলাইন স্কুল' },
        { icon: ChalkboardTeacher, title: 'দেশসেরা শিক্ষক', body: 'Munzereen Shahid, Ayman Sadiq সহ' },
        { icon: PlayCircle, title: 'লাইভ + রেকর্ডেড ক্লাস', body: 'ক্লাস মিস হলেও রেকর্ডিং থাকছে' },
        { icon: ChatsCircle, title: '২৪/৭ ডাউট সল্ভিং', body: 'TenTen দিয়ে যেকোনো সময় উত্তর' },
    ];
    return (
        <Reveal className="container-x mt-12 sm:mt-16">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-7 lg:grid-cols-4 lg:gap-x-10">
                {items.map((it) => (
                    <li key={it.title} className="flex items-start gap-3">
                        <it.icon size={26} weight="duotone" className="mt-0.5 shrink-0 text-brand-600" />
                        <div>
                            <p className="text-[15px] font-bold text-ink">{it.title}</p>
                            <p className="mt-0.5 text-[13px] text-ink-2">{it.body}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Reveal>
    );
}

function Academic({ categories }) {
    const academic = categories.filter((c) => c.group === 'academic');
    const rail = useRail();
    if (academic.length === 0) return null;
    return (
        <section className="mt-20 sm:mt-24">
            <div className="container-x">
                <SectionHeader title="একাডেমিক কোর্স" text="ক্লাস ১ থেকে HSC ও ভর্তি পরীক্ষা পর্যন্ত, প্রতিটি ধাপের অনলাইন ব্যাচ।" href="/courses?group=academic" linkLabel="সব একাডেমিক কোর্স" />
                <Reveal className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[13px] font-semibold text-ink-3">ক্লাস</span>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <Link key={n} href={`/courses?class=${n}`} aria-label={`ক্লাস ${bn(n)}`} className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-line bg-surface-2 px-3 text-[14px] font-semibold text-ink transition-colors hover:border-brand-400 hover:text-brand-700">
                            {bn(n)}
                        </Link>
                    ))}
                    <RailArrows rail={rail} className="ml-auto hidden sm:flex" />
                </Reveal>
            </div>
            <Rail rail={rail} className="mt-6 pb-2">
                {academic.map((cat, i) => (
                    <Reveal key={cat.id} delay={Math.min(i * 0.05, 0.25)} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
                        <Link href={`/courses?category=${cat.slug}`} className="group card-surface block h-full overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-line-2 hover:shadow-card-hover">
                            <CourseImage src={cat.thumb} alt="" className="rounded-t-[15px] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out-expo group-hover:[&_img]:scale-[1.03]" />
                            <div className="p-4">
                                <h3 className="text-base font-bold text-ink">{cat.name}</h3>
                                <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-2">{cat.tagline}</p>
                                <p className="mt-3 text-[13px] font-semibold text-brand-600">{number(cat.courses_count)}টি কোর্স</p>
                            </div>
                        </Link>
                    </Reveal>
                ))}
            </Rail>
        </section>
    );
}

function FeaturedBento({ courses }) {
    if (courses.length < 3) return null;
    const [lead, ...rest] = courses;
    const bento = courses.length === 6;
    return (
        <section className="container-x mt-20 sm:mt-24">
            <SectionHeader title="এই মাসের ফিচার্ড কোর্স" />
            <div className={cx('mt-6 grid gap-4 sm:gap-5', bento ? 'lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3')}>
                <Reveal className={cx(bento && 'lg:col-span-2 lg:row-span-2')}>
                    <Link href={route('courses.show', lead.slug)} className="group card-surface flex h-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-line-2 hover:shadow-card-hover">
                        <CourseImage src={lead.image_url} alt="" className="rounded-t-[15px] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out-expo group-hover:[&_img]:scale-[1.03]" sizes="(min-width: 1024px) 800px, 100vw" />
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <p className="text-[13px] font-medium text-ink-2">{lead.category?.name}{lead.instructor ? ` · ${lead.instructor}` : ''}</p>
                            <h3 className="mt-1.5 max-w-xl text-xl font-bold text-ink sm:text-2xl">{lead.title}</h3>
                            {lead.description && <p className="mt-2 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-ink-2">{lead.description}</p>}
                            <div className="mt-auto flex items-center gap-3 pt-5">
                                <span className="text-xl font-bold text-ink">{priceLabel(lead)}</span>
                                {lead.discount_percent && <span className="text-sm text-ink-3 line-through">{taka(lead.original_price)}</span>}
                                {lead.discount_percent && <span className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">{bn(lead.discount_percent)}% ছাড়</span>}
                                <span className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-btn bg-brand-600 text-white transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight size={18} weight="bold" /></span>
                            </div>
                        </div>
                    </Link>
                </Reveal>
                {rest.map((course, i) => (
                    <Reveal key={course.id} delay={0.05 * (i + 1)}>
                        <CourseCard course={course} />
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

function Skills({ categories, freeCount }) {
    const skills = categories.filter((c) => c.group === 'skills' && c.courses_count > 0);
    if (skills.length === 0) return null;
    const odd = skills.length % 2 === 1 && freeCount > 0;
    return (
        <section className="container-x mt-20 sm:mt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <Reveal className="lg:col-span-4">
                    <h2 className="text-2xl font-bold text-ink sm:text-[1.75rem]">স্কিল কোর্স</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">ভাষা, ফ্রিল্যান্সিং, ডিজাইন, প্রোগ্রামিং ও ক্যারিয়ার। দেশসেরা ইন্সট্রাক্টরদের কাছে, নিজের গতিতে।</p>
                    <Button href="/courses?group=skills" variant="secondary" className="mt-6">সব স্কিল কোর্স</Button>
                </Reveal>
                <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
                    {skills.map((cat, i) => (
                        <Reveal key={cat.id} delay={Math.min(i * 0.04, 0.25)}>
                            <Link href={`/courses?category=${cat.slug}`} className="group flex items-center gap-4 rounded-card border border-line bg-surface-2 p-3 transition-[box-shadow,border-color] duration-300 hover:border-line-2 hover:shadow-card-hover">
                                <CourseImage src={cat.thumb} alt="" className="w-24 shrink-0 rounded-lg" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[15px] font-bold text-ink">{cat.name}</p>
                                    <p className="mt-0.5 text-[13px] text-ink-2">{number(cat.courses_count)}টি কোর্স</p>
                                </div>
                                <ArrowUpRight size={18} className="shrink-0 text-ink-3 transition-colors group-hover:text-brand-600" />
                            </Link>
                        </Reveal>
                    ))}
                    {odd && (
                        <Reveal delay={0.3}>
                            <Link href="/courses?free=1" className="group flex h-full items-center gap-4 rounded-card border border-dashed border-line-2 p-3 transition-colors hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-950/20">
                                <span className="flex h-[54px] w-24 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-[13px] font-bold text-emerald-700 dark:text-emerald-400">ফ্রি</span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[15px] font-bold text-ink">ফ্রি কোর্স</p>
                                    <p className="mt-0.5 text-[13px] text-ink-2">{number(freeCount)}টি কোর্স</p>
                                </div>
                                <ArrowUpRight size={18} className="shrink-0 text-ink-3 transition-colors group-hover:text-brand-600" />
                            </Link>
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}

function Popular({ courses }) {
    if (courses.length === 0) return null;
    return (
        <section className="container-x mt-20 sm:mt-24">
            <SectionHeader title="জনপ্রিয় কোর্স" href="/courses" linkLabel="সব কোর্স" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {courses.map((course, i) => (
                    <Reveal key={course.id} delay={Math.min((i % 4) * 0.05, 0.2)}>
                        <CourseCard course={course} />
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        { title: 'এখানে কোর্স খুঁজুন', body: 'ক্লাস বা স্কিল অনুযায়ী ব্রাউজ করুন, দাম মিলিয়ে দেখুন আর কোর্সে কী কী আছে জেনে নিন।' },
        { title: 'টেন মিনিট স্কুলে যান', body: 'ভর্তি বাটনে ক্লিক করলেই সরাসরি অফিসিয়াল কোর্স পেজে পৌঁছে যাবেন।' },
        { title: 'সেখানেই ভর্তি হোন', body: 'পেমেন্ট সরাসরি টেন মিনিট স্কুলকে। একই কোর্স, একই দাম, একই সার্টিফিকেট।' },
    ];
    return (
        <section className="container-x mt-20 sm:mt-24">
            <Reveal className="rounded-band bg-surface-3 px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                <h2 className="text-2xl font-bold text-ink sm:text-[1.75rem]">যেভাবে কাজ করে</h2>
                <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-8">
                    {steps.map((s, i) => (
                        <li key={s.title}>
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-btn bg-brand-600 text-[15px] font-bold text-white">{bn(i + 1)}</span>
                            <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                        </li>
                    ))}
                </ol>
            </Reveal>
        </section>
    );
}

function FreeList({ courses }) {
    if (courses.length === 0) return null;
    return (
        <section className="container-x mt-20 sm:mt-24">
            <SectionHeader title="ফ্রি দিয়ে শুরু করুন" text="পেইড কোর্সে যাওয়ার আগে একটি সম্পূর্ণ কোর্স বিনামূল্যে দেখে নিন।" href="/courses?free=1" linkLabel="সব ফ্রি কোর্স" />
            <ul className="mt-6 divide-y divide-line rounded-card border border-line bg-surface-2">
                {courses.map((course, i) => (
                    <Reveal as="li" key={course.id} delay={i * 0.04}>
                        <Link href={route('courses.show', course.slug)} className="group flex items-center gap-4 p-3.5 transition-colors hover:bg-surface-3 sm:p-4">
                            <CourseImage src={course.image_url} alt="" className="w-24 shrink-0 rounded-lg sm:w-32" />
                            <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-[15px] font-bold text-ink">{course.title}</p>
                                <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-2">{course.instructor || course.category?.name}</p>
                            </div>
                            <span className="hidden text-[14px] font-bold text-emerald-700 dark:text-emerald-400 sm:block">ফ্রি</span>
                            <ArrowUpRight size={18} className="shrink-0 text-ink-3 transition-colors group-hover:text-brand-600" />
                        </Link>
                    </Reveal>
                ))}
            </ul>
        </section>
    );
}

export default function Home({ banners = [], categories, featured, popular, free, stats }) {
    const fallback = [...featured, ...popular].find((c) => c.image_url);

    return (
        <PublicLayout>
            <Head title="টেন মিনিট স্কুলের সব কোর্স এক জায়গায়" />
            {banners.length > 0 ? <BannerCarousel banners={banners} /> : <HeroFallback course={fallback} />}
            <TrustStrip />
            <Academic categories={categories} />
            <FeaturedBento courses={featured} />
            <Skills categories={categories} freeCount={stats?.free || 0} />
            <Popular courses={popular} />
            <HowItWorks />
            <FreeList courses={free} />
            <section className="container-x mt-20 sm:mt-24">
                <Reveal className="rounded-band bg-brand-600 px-6 py-12 text-center text-white sm:px-10 sm:py-14">
                    <h2 className="text-balance text-2xl font-bold sm:text-3xl">কোথা থেকে শুরু করবেন বুঝতে পারছেন না?</h2>
                    <p className="mx-auto mt-3 max-w-md text-[15px] text-white/85 sm:text-base">সব কোর্স সার্চ করুন, ক্লাস বা দাম দিয়ে ফিল্টার করুন, আর আপনার জন্য সঠিক কোর্সটি বেছে নিন।</p>
                    <Button href="/courses" variant="dark" size="lg" className="mt-7 !bg-white !text-brand-700 hover:!bg-brand-50">সব কোর্স দেখুন</Button>
                </Reveal>
            </section>
        </PublicLayout>
    );
}
