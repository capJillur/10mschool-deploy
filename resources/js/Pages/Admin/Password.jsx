import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import { Field, Input } from '@/Components/Form';

export default function Password() {
    const { data, setData, put, processing, errors, reset } = useForm({ current_password: '', password: '', password_confirmation: '' });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/password', { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <AdminLayout title="পাসওয়ার্ড বদলান">
            <Head title="পাসওয়ার্ড বদলান" />
            <form onSubmit={submit} className="card-surface max-w-lg space-y-5 p-5 sm:p-6">
                <p className="text-[15px] text-ink-2">সাইট চালু করার পর ডিফল্ট পাসওয়ার্ডটি অবশ্যই বদলে নিন।</p>
                <Field label="বর্তমান পাসওয়ার্ড" htmlFor="current_password" error={errors.current_password}>
                    <Input id="current_password" type="password" autoComplete="current-password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} invalid={!!errors.current_password} required />
                </Field>
                <Field label="নতুন পাসওয়ার্ড" htmlFor="password" hint="কমপক্ষে ৮ অক্ষর" error={errors.password}>
                    <Input id="password" type="password" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} invalid={!!errors.password} required />
                </Field>
                <Field label="নতুন পাসওয়ার্ড আবার লিখুন" htmlFor="password_confirmation" error={errors.password_confirmation}>
                    <Input id="password_confirmation" type="password" autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                </Field>
                <Button type="submit" disabled={processing}>{processing ? 'সংরক্ষণ হচ্ছে' : 'পাসওয়ার্ড বদলান'}</Button>
            </form>
        </AdminLayout>
    );
}
