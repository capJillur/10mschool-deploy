import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowSquareOut,
    BookOpenText,
    Image as ImageIcon,
    LockKey,
    ChartLineUp,
    List,
    Receipt,
    SignOut,
    SquaresFour,
    X,
} from '@phosphor-icons/react';
import Flash from '@/Components/Flash';
import { cx } from '@/lib/format';

const NAV = [
    { label: 'ড্যাশবোর্ড', href: '/admin', icon: ChartLineUp, exact: true },
    { label: 'কোর্স', href: '/admin/courses', icon: BookOpenText },
    { label: 'ব্যানার', href: '/admin/banners', icon: ImageIcon },
    { label: 'ক্যাটাগরি', href: '/admin/categories', icon: SquaresFour },
    { label: 'সেলস', href: '/admin/sales', icon: Receipt },
    { label: 'পাসওয়ার্ড', href: '/admin/password', icon: LockKey },
];

function NavLinks({ url, onNavigate }) {
    return (
        <nav className="grid gap-1" aria-label="অ্যাডমিন মেনু">
            {NAV.map(({ label, href, icon: Icon, exact }) => {
                const path = url.split('?')[0];
                const active = exact ? path === href : path.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={cx(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                            active ? 'bg-ink text-surface' : 'text-ink-2 hover:bg-surface-3 hover:text-ink',
                        )}
                    >
                        <Icon size={20} weight={active ? 'fill' : 'regular'} />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AdminLayout({ title, actions, children }) {
    const { url, props } = usePage();
    const [open, setOpen] = useState(false);

    useEffect(() => setOpen(false), [url]);

    const logout = () => router.post('/logout');

    return (
        <div className="min-h-[100dvh] bg-surface lg:grid lg:grid-cols-[260px_1fr]">
            <aside className="hidden border-r border-line bg-surface-2 lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:flex-col">
                <div className="flex h-16 items-center border-b border-line px-5">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">10</span>
                        <span className="text-sm font-bold text-ink">অ্যাফিলিয়েট অ্যাডমিন</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <NavLinks url={url} />
                </div>
                <div className="border-t border-line p-4">
                    <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-3 hover:text-ink">
                        <ArrowSquareOut size={20} />
                        সাইট দেখুন
                    </a>
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-surface-3 px-3 py-2.5">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{props.auth?.user?.name}</p>
                            <p className="truncate text-xs text-ink-3">{props.auth?.user?.email}</p>
                        </div>
                        <button type="button" onClick={logout} className="rounded-lg p-2 text-ink-2 hover:bg-surface-2 hover:text-ink" aria-label="লগ আউট">
                            <SignOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex min-h-[100dvh] flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                    <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink hover:bg-surface-3 lg:hidden" aria-label="মেনু খুলুন">
                        <List size={22} />
                    </button>
                    <h1 className="truncate text-lg font-bold tracking-tight text-ink">{title}</h1>
                    <div className="ml-auto flex items-center gap-2">{actions}</div>
                </header>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-50 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="মেনু বন্ধ করুন" />
                        <motion.div
                            initial={{ x: -24 }}
                            animate={{ x: 0 }}
                            exit={{ x: -24 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface-2 shadow-pop"
                        >
                            <div className="flex h-16 items-center justify-between border-b border-line px-4">
                                <span className="text-sm font-bold text-ink">অ্যাফিলিয়েট অ্যাডমিন</span>
                                <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ink hover:bg-surface-3" aria-label="মেনু বন্ধ করুন">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 p-4">
                                <NavLinks url={url} onNavigate={() => setOpen(false)} />
                            </div>
                            <div className="border-t border-line p-4">
                                <a href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-3">
                                    <ArrowSquareOut size={20} /> সাইট দেখুন
                                </a>
                                <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-3">
                                    <SignOut size={20} /> লগ আউট
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Flash />
        </div>
    );
}
