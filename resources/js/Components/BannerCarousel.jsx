import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import Button from '@/Components/Button';
import CourseImage from '@/Components/CourseImage';
import { bn, cx } from '@/lib/format';

const ease = [0.16, 1, 0.3, 1];
const INTERVAL = 6500;

/* Accent only tints the soft glow behind the image, so the page stays neutral. */
const GLOW = {
    rose: 'bg-brand-500/15',
    sun: 'bg-amber-400/20',
    sky: 'bg-sky-400/20',
    mint: 'bg-emerald-400/20',
    berry: 'bg-violet-400/20',
};

function Cta({ href, children }) {
    const external = /^https?:\/\//.test(href);
    return (
        <Button as={external ? 'a' : undefined} href={href} size="lg" rel={external ? 'nofollow sponsored' : undefined}>
            {children} <ArrowRight size={18} weight="bold" />
        </Button>
    );
}

/* Hero slideshow fed by admin banners. Autoplays, pauses on hover, swipes on touch. */
export default function BannerCarousel({ banners }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const reduce = useReducedMotion();
    const count = banners.length;
    const go = (i) => setIndex(((i % count) + count) % count);

    useEffect(() => {
        if (count < 2 || paused || reduce) return undefined;
        const t = setTimeout(() => go(index + 1), INTERVAL);
        return () => clearTimeout(t);
    }, [index, paused, count, reduce]);

    if (count === 0) return null;
    const b = banners[index];

    return (
        <section
            className="container-x pb-4 pt-8 sm:pt-12 lg:pt-16"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="প্রমোশনাল ব্যানার"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={b.id}
                    drag={count > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                        if (info.offset.x < -60) go(index + 1);
                        else if (info.offset.x > 60) go(index - 1);
                    }}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
                >
                    <div className="order-2 lg:order-1 lg:col-span-6">
                        <motion.h1
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.05, ease }}
                            className="text-balance text-3xl font-bold text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.3]"
                        >
                            {b.title}
                        </motion.h1>
                        {b.subtitle && (
                            <motion.p
                                initial={reduce ? false : { opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.12, ease }}
                                className="mt-4 max-w-lg text-base leading-relaxed text-ink-2 sm:text-lg"
                            >
                                {b.subtitle}
                            </motion.p>
                        )}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.19, ease }}
                            className="mt-7 flex flex-wrap items-center gap-3"
                        >
                            <Cta href={b.url}>{b.cta_label || 'বিস্তারিত দেখুন'}</Cta>
                            <Button href="/courses" variant="secondary" size="lg">সব কোর্স দেখুন</Button>
                        </motion.div>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-6">
                        <div className="relative">
                            <div className={cx('pointer-events-none absolute -inset-6 rounded-[40px] blur-3xl', GLOW[b.accent] || GLOW.rose)} aria-hidden="true" />
                            <motion.div
                                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.08, ease }}
                                className="relative overflow-hidden rounded-card border border-line bg-surface-2 shadow-card-hover"
                            >
                                <CourseImage src={b.image_url} alt="" priority={index === 0} sizes="(min-width: 1024px) 600px, 100vw" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {count > 1 && (
                <div className="mt-6 flex items-center justify-between lg:mt-8">
                    <div className="flex items-center gap-2" role="tablist" aria-label="ব্যানার বেছে নিন">
                        {banners.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`ব্যানার ${bn(i + 1)}`}
                                onClick={() => go(i)}
                                className={cx('h-2 rounded-full transition-all duration-500 ease-out-expo', i === index ? 'w-8 bg-brand-600' : 'w-2 bg-line-2 hover:bg-ink-3')}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => go(index - 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-line bg-surface-2 text-ink transition hover:border-ink-3 hover:bg-surface-3" aria-label="আগের ব্যানার">
                            <CaretLeft size={18} weight="bold" />
                        </button>
                        <button type="button" onClick={() => go(index + 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-line bg-surface-2 text-ink transition hover:border-ink-3 hover:bg-surface-3" aria-label="পরের ব্যানার">
                            <CaretRight size={18} weight="bold" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
