import { cx } from '@/lib/format';

export const inputClass =
    'h-11 w-full rounded-input border border-line-2 bg-surface-2 px-3.5 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-ink focus:outline-none disabled:opacity-60';

export function Field({ label, hint, error, htmlFor, children, className }) {
    return (
        <div className={cx('grid gap-1.5', className)}>
            <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">{label}</label>
            {children}
            {hint && !error && <p className="text-[13px] text-ink-3">{hint}</p>}
            {error && <p className="text-[13px] font-medium text-brand-600">{error}</p>}
        </div>
    );
}

export function Input({ className, invalid, ...props }) {
    return <input className={cx(inputClass, invalid && 'border-brand-500', className)} {...props} />;
}

export function Textarea({ className, invalid, rows = 5, ...props }) {
    return <textarea rows={rows} className={cx(inputClass, 'h-auto py-3 leading-relaxed', invalid && 'border-brand-500', className)} {...props} />;
}

export function Select({ className, invalid, children, ...props }) {
    return (
        <select className={cx(inputClass, 'pr-9', invalid && 'border-brand-500', className)} {...props}>
            {children}
        </select>
    );
}

export function Toggle({ checked, onChange, label, description, disabled }) {
    return (
        <label className={cx('flex cursor-pointer items-start justify-between gap-4 rounded-input border border-line px-3.5 py-3', disabled && 'opacity-60')}>
            <span>
                <span className="block text-sm font-semibold text-ink">{label}</span>
                {description && <span className="block text-[13px] text-ink-3">{description}</span>}
            </span>
            <span className="relative mt-0.5 inline-flex shrink-0">
                <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
                <span className="h-6 w-11 rounded-full bg-line-2 transition-colors peer-checked:bg-brand-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
        </label>
    );
}

export function StatTile({ label, value, sub, tone }) {
    return (
        <div className="card-surface p-5">
            <p className="text-[13px] font-semibold text-ink-2">{label}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
            {sub && <p className={cx('mt-1 text-[13px] font-medium', tone === 'up' ? 'text-emerald-600 dark:text-emerald-400' : tone === 'down' ? 'text-brand-600' : 'text-ink-3')}>{sub}</p>}
        </div>
    );
}
