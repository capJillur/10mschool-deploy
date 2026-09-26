import { Link } from '@inertiajs/react';
import { cx } from '@/lib/format';

export default function Logo({ className, href = '/' }) {
    return (
        <Link href={href} className={cx('inline-flex shrink-0 items-center', className)} aria-label="টেন মিনিট স্কুল অ্যাফিলিয়েশন, হোম">
            <span className="inline-flex items-center rounded-lg bg-white px-1.5 py-1 dark:bg-white/95">
                <img src="/assets/images/logo3.png" alt="" className="h-8 w-auto sm:h-9" />
            </span>
        </Link>
    );
}
