import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { List, MagnifyingGlass, Moon, Sun, X } from '@phosphor-icons/react';
import Logo from '@/Components/Logo';
import Flash from '@/Components/Flash';
import { useTheme } from '@/lib/theme';
import { bn, cx } from '@/lib/format';

const NAV = [
    { label: 'একাডেমিক', href: '/courses?group=academic', match: (u) => u.includes('group=academic') || u.includes('class=') },
    { label: 'স্কিলস', href: '/courses?group=skills', match: (u) => u.includes('group=skills') },
    { label: 'ফ্রি কোর্স', href: '/courses?free=1', match: (u) => u.includes('free=1') },
];

function SearchForm({ className, autoFocus = false, onSubmit }) {
    const [q, setQ] = useState('');
    return (
        <form
            role="search"
            className={cx('relative', className)}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.();
                router.get('/courses', q.trim() ? { q: q.trim() } : {});
            }}
        >
            <label htmlFor="site-search" className="sr-only">কোর্স খুঁজুন</label>
            <MagnifyingGlass size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
                id="site-search"
                type="search"
                value={q}
                autoFocus={autoFocus}
                onChange={(e) => setQ(e.target.value)}
                placeholder="কোর্স খুঁজুন"
                className="h-10 w-full rounded-full border border-line bg-surface-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-3 focus:border-ink-3 focus:bg-surface-2 focus:outline-none"
            />
        </form>
    );
}

export default function PublicLayout({ children }) {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const reduce = useReducedMotion();
    const year = new Date().getFullYear();

    useEffect(() => {
        setOpen(false);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <div className="flex min-h-[100dvh] flex-col">
            <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-xl">
                <div className="container-x flex h-16 items-center gap-3 sm:gap-6">
                    <Logo />

                    <nav className="hidden items-center gap-1 lg:flex" aria-label="প্রধান মেনু">
                        {NAV.map((item) => {
                            const active = item.match(url);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cx(
                                        'relative rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors',
                                        active ? 'text-ink' : 'text-ink-2 hover:text-ink',
                                    )}
                                >
                                    {active && (
                                        <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-surface-3" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                                    )}
                                    <span className="relative">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <SearchForm className="hidden w-56 md:block xl:w-72" />
                        <button
                            type="button"
                            onClick={theme.toggle}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
                            aria-label={theme.isDark ? 'লাইট মোড' : 'ডার্ক মোড'}
                        >
                            {theme.isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-3 lg:hidden"
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
                        >
                            {open ? <X size={22} /> : <List size={22} />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            id="mobile-menu"
                            initial={reduce ? false : { opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-surface shadow-pop lg:hidden"
                        >
                            <div className="container-x space-y-5 py-5">
                                <SearchForm autoFocus onSubmit={() => setOpen(false)} />
                                <nav className="grid gap-1" aria-label="মোবাইল মেনু">
                                    {NAV.map((item) => (
                                        <Link key={item.label} href={item.href} className="rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-surface-3">
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div>
                                    <p className="mb-2 px-3 text-[13px] font-semibold text-ink-3">আপনার ক্লাস বেছে নিন</p>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                                            <Link
                                                key={n}
                                                href={`/courses?class=${n}`}
                                                className="flex h-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-[15px] font-bold text-ink hover:border-ink-3"
                                                aria-label={`ক্লাস ${bn(n)}`}
                                            >
                                                {bn(n)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <motion.main
                className="flex-1"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.main>

            <footer className="mt-24 border-t border-line bg-surface-2">
                <div className="container-x grid gap-10 py-14 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <Logo />
                        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">
                            টেন মিনিট স্কুলের কোর্সের জন্য একটি স্বাধীন অ্যাফিলিয়েট সাইট। সব কেনাকাটা 10minuteschool.com-এ হয়,
                            আর আমাদের লিংক দিয়ে ভর্তি হলে আমরা কমিশন পেতে পারি।
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
                        <div>
                            <p className="mb-3 text-[15px] font-bold text-ink">ব্রাউজ করুন</p>
                            <ul className="space-y-2 text-[15px] text-ink-2">
                                <li><Link href="/courses" className="hover:text-ink">সব কোর্স</Link></li>
                                <li><Link href="/courses?group=academic" className="hover:text-ink">একাডেমিক</Link></li>
                                <li><Link href="/courses?group=skills" className="hover:text-ink">স্কিলস</Link></li>
                                <li><Link href="/courses?free=1" className="hover:text-ink">ফ্রি কোর্স</Link></li>
                            </ul>
                        </div>
                        <div>
                            <p className="mb-3 text-[15px] font-bold text-ink">ক্লাস</p>
                            <ul className="grid max-w-[220px] grid-cols-6 gap-1.5">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                                    <li key={n}>
                                        <Link href={`/courses?class=${n}`} className="flex h-8 items-center justify-center rounded-lg border border-line text-[13px] font-semibold text-ink-2 hover:border-ink-3 hover:text-ink" aria-label={`ক্লাস ${bn(n)}`}>{bn(n)}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="mb-3 text-[15px] font-bold text-ink">টেন মিনিট স্কুল</p>
                            <ul className="space-y-2 text-[15px] text-ink-2">
                                <li><a href="https://10minuteschool.com" target="_blank" rel="noreferrer" className="hover:text-ink">10minuteschool.com</a></li>
                                <li><a href="https://affiliation.10minuteschool.com" target="_blank" rel="noreferrer" className="hover:text-ink">অ্যাফিলিয়েট প্রোগ্রাম</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t border-line">
                    <div className="container-x flex flex-col gap-2 py-5 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
                        <span>© {bn(year)} টেন মিনিট স্কুল অ্যাফিলিয়েশন। এটি টেন মিনিট স্কুল পরিচালিত সাইট নয়।</span>
                        <span>কোর্সের নাম, দাম ও ছবি টেন মিনিট স্কুলের।</span>
                    </div>
                </div>
            </footer>

            <Flash />
        </div>
    );
}
