import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import CourseImage from '@/Components/CourseImage';
import { priceLabel, taka, cx, isFree, bn } from '@/lib/format';

export default function CourseCard({ course, className, priority = false }) {
    const reduce = useReducedMotion();
    const href = route('courses.show', course.slug);
    const free = isFree(course);

    return (
        <motion.article
            whileHover={reduce ? undefined : { y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={cx(
                'group card-surface flex h-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-line-2 hover:shadow-card-hover',
                className,
            )}
        >
            <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
                <CourseImage src={course.image_url} alt="" priority={priority} className="rounded-t-[15px] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out-expo group-hover:[&_img]:scale-[1.04]" />
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] font-medium text-ink-2">
                    {course.category && <span>{course.category.name}</span>}
                    {course.badge && (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                            {course.badge}
                        </span>
                    )}
                </div>

                <h3 className="text-[15px] font-bold leading-snug text-ink sm:text-base">
                    <Link href={href} className="line-clamp-2 outline-none after:absolute after:inset-0 focus-visible:underline">
                        {course.title}
                    </Link>
                </h3>

                {course.instructor && (
                    <p className="mt-1 line-clamp-1 text-[13px] text-ink-2">{course.instructor}</p>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div className="flex items-baseline gap-2">
                        <span className={cx('text-lg font-extrabold tracking-tight', free ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink')}>
                            {priceLabel(course)}
                        </span>
                        {course.discount_percent && (
                            <span className="text-[13px] text-ink-3 line-through">{taka(course.original_price)}</span>
                        )}
                    </div>
                    {course.discount_percent && (
                        <span className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400">
                            {bn(course.discount_percent)}% ছাড়
                        </span>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
