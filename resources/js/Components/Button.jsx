import { Link } from '@inertiajs/react';
import { cx } from '@/lib/format';

const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    dark: 'bg-ink text-surface hover:opacity-90',
    secondary: 'bg-surface-2 text-ink border border-line-2 hover:border-ink-3 hover:bg-surface-3',
    ghost: 'text-ink-2 hover:text-ink hover:bg-surface-3',
    danger: 'bg-red-50 text-brand-700 border border-brand-200 hover:bg-brand-100 dark:bg-brand-950/40 dark:border-brand-900',
};

const sizes = {
    sm: 'h-9 px-4 text-[13px] gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-12 px-6 text-[15px] gap-2',
};

export default function Button({
    as,
    href,
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) {
    const classes = cx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-btn font-semibold transition-[background-color,border-color,color,transform,opacity] duration-200 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
    );
    if (href && as === 'a') {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }
    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }
    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
}
