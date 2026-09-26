import { Head, Link, router, useForm } from '@inertiajs/react';
import { Trash } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import { Field, Input, Select, StatTile } from '@/Components/Form';
import { number, taka, bn } from '@/lib/format';

export default function Index({ sales, courses, totals, defaultRate }) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: courses[0]?.id || '',
        amount: courses[0]?.price ?? '',
        commission: '',
        sold_at: today,
        note: '',
    });

    const pickCourse = (id) => {
        const c = courses.find((x) => String(x.id) === String(id));
        setData((d) => ({ ...d, course_id: id, amount: c?.price ?? d.amount }));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/sales', { preserveScroll: true, onSuccess: () => reset('commission', 'note') });
    };

    const suggested = data.amount ? Math.round(Number(data.amount) * defaultRate) : null;

    return (
        <AdminLayout title="সেলস">
            <Head title="সেলস" />

            <div className="grid gap-4 sm:grid-cols-3">
                <StatTile label="রেকর্ড করা সেলস" value={number(totals.count)} />
                <StatTile label="মোট বিক্রয়মূল্য" value={taka(totals.amount)} />
                <StatTile label="মোট কমিশন" value={taka(totals.commission)} />
            </div>

            <section className="card-surface mt-6 p-5 sm:p-6">
                <h2 className="text-sm font-bold text-ink">সেল রেকর্ড করুন</h2>
                <p className="mb-4 mt-1 text-[13px] text-ink-2">টেন মিনিট স্কুল তাদের অ্যাফিলিয়েট ড্যাশবোর্ডে সেলস দেখায়। ক্লিকের পাশে দেখতে সেগুলো এখানে লিখে রাখুন।</p>
                <form onSubmit={submit} className="grid gap-4 md:grid-cols-6">
                    <Field label="কোর্স" htmlFor="course_id" error={errors.course_id} className="md:col-span-2">
                        <Select id="course_id" value={data.course_id} onChange={(e) => pickCourse(e.target.value)}>
                            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </Select>
                    </Field>
                    <Field label="পরিমাণ (৳)" htmlFor="amount" error={errors.amount}>
                        <Input id="amount" type="number" min="0" step="1" value={data.amount} onChange={(e) => setData('amount', e.target.value)} required />
                    </Field>
                    <Field label="কমিশন (৳)" htmlFor="commission" hint={suggested !== null ? `খালি রাখলে ${bn(Math.round(defaultRate * 100))}% হারে ${taka(suggested)}` : undefined} error={errors.commission}>
                        <Input id="commission" type="number" min="0" step="1" value={data.commission} onChange={(e) => setData('commission', e.target.value)} placeholder={suggested ?? ''} />
                    </Field>
                    <Field label="তারিখ" htmlFor="sold_at" error={errors.sold_at}>
                        <Input id="sold_at" type="date" value={data.sold_at} max={today} onChange={(e) => setData('sold_at', e.target.value)} required />
                    </Field>
                    <Field label="নোট" htmlFor="note" error={errors.note}>
                        <Input id="note" value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="অর্ডার আইডি" />
                    </Field>
                    <div className="md:col-span-6">
                        <Button type="submit" disabled={processing || courses.length === 0}>সেল রেকর্ড করুন</Button>
                    </div>
                </form>
            </section>

            <section className="card-surface mt-6 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-line bg-surface-3 text-left text-[13px] font-semibold text-ink-3">
                        <tr>
                            <th className="px-5 py-3">তারিখ</th>
                            <th className="px-3 py-3">কোর্স</th>
                            <th className="hidden px-3 py-3 sm:table-cell">নোট</th>
                            <th className="px-3 py-3 text-right">পরিমাণ</th>
                            <th className="px-3 py-3 text-right">কমিশন</th>
                            <th className="px-5 py-3"><span className="sr-only">মুছুন</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {sales.data.map((s) => (
                            <tr key={s.id} className="hover:bg-surface-3/60">
                                <td className="whitespace-nowrap px-5 py-3 text-ink-2">{bn(s.sold_at)}</td>
                                <td className="px-3 py-3">
                                    <Link href={`/admin/courses/${s.course_id}/edit`} className="line-clamp-1 font-semibold text-ink hover:text-brand-600">{s.course?.title || 'মুছে ফেলা কোর্স'}</Link>
                                </td>
                                <td className="hidden px-3 py-3 text-ink-2 sm:table-cell">{s.note}</td>
                                <td className="px-3 py-3 text-right text-ink">{taka(s.amount)}</td>
                                <td className="px-3 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">{taka(s.commission)}</td>
                                <td className="px-5 py-3 text-right">
                                    <button type="button" onClick={() => window.confirm('এই সেলটি মুছে ফেলবেন?') && router.delete(`/admin/sales/${s.id}`, { preserveScroll: true })} className="rounded-full p-2 text-ink-3 hover:bg-surface-3 hover:text-brand-600" aria-label="সেল মুছুন"><Trash size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {sales.data.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-ink-2">এখনো কোনো সেল রেকর্ড করা হয়নি।</td></tr>
                        )}
                    </tbody>
                </table>
                {sales.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px] text-ink-2">
                        <span>{bn(sales.from)}-{bn(sales.to)} / {bn(sales.total)}</span>
                        <div className="flex gap-1">
                            {sales.prev_page_url && <Link href={sales.prev_page_url} className="rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-surface-3">আগের</Link>}
                            {sales.next_page_url && <Link href={sales.next_page_url} className="rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-surface-3">পরের</Link>}
                        </div>
                    </div>
                )}
            </section>
        </AdminLayout>
    );
}
