import { Head, Link, useForm } from '@inertiajs/react';
import Button from '@/Components/Button';
import Logo from '@/Components/Logo';
import { cx } from '@/lib/format';

function Field({ label, error, children }) {
    return (
        <div className="grid gap-2">
            <span className="text-[15px] font-semibold text-ink">{label}</span>
            {children}
            {error && <p className="text-[14px] font-medium text-brand-600">{error}</p>}
        </div>
    );
}

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    const input = 'h-11 w-full rounded-input border border-line-2 bg-surface-2 px-3.5 text-[15px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none';

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-surface px-4 py-10">
            <Head title="অ্যাডমিন লগইন" />
            <div className="w-full max-w-sm">
                <div className="flex justify-center"><Logo /></div>
                <div className="card-surface mt-8 p-6 sm:p-8">
                    <h1 className="text-xl font-extrabold text-ink">অ্যাডমিন প্যানেলে সাইন ইন করুন</h1>
                    <p className="mt-1 text-[15px] text-ink-2">কোর্স, লিংক ও ট্র্যাকিং ম্যানেজ করুন।</p>
                    <form onSubmit={submit} className="mt-6 grid gap-5">
                        <Field label="ইমেইল" error={errors.email}>
                            <input type="email" autoComplete="username" value={data.email} onChange={(e) => setData('email', e.target.value)} className={cx(input, errors.email && 'border-brand-500')} required autoFocus />
                        </Field>
                        <Field label="পাসওয়ার্ড" error={errors.password}>
                            <input type="password" autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={cx(input, errors.password && 'border-brand-500')} required />
                        </Field>
                        <label className="flex items-center gap-2 text-[15px] text-ink-2">
                            <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="h-4 w-4 accent-brand-600" />
                            লগইন থাকুন
                        </label>
                        <Button type="submit" disabled={processing} className="w-full">{processing ? 'সাইন ইন হচ্ছে' : 'সাইন ইন'}</Button>
                    </form>
                </div>
                <p className="mt-6 text-center text-[15px] text-ink-2">
                    <Link href="/" className="font-semibold text-ink hover:text-brand-600">সাইটে ফিরে যান</Link>
                </p>
            </div>
        </div>
    );
}
