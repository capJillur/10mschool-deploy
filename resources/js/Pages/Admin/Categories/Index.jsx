import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import { Field, Input, Select } from '@/Components/Form';
import { number, bn } from '@/lib/format';

function CategoryForm({ initial, onDone, submitLabel }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        group: initial?.group || 'skills',
        name: initial?.name || '',
        tagline: initial?.tagline || '',
        class_min: initial?.class_min ?? '',
        class_max: initial?.class_max ?? '',
        sort_order: initial?.sort_order ?? 0,
    });

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: () => { reset(); onDone?.(); } };
        if (initial?.id) put(`/admin/categories/${initial.id}`, opts);
        else post('/admin/categories', opts);
    };

    return (
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-6">
            <Field label="গ্রুপ" htmlFor={`group-${initial?.id || 'new'}`} error={errors.group} className="sm:col-span-1">
                <Select id={`group-${initial?.id || 'new'}`} value={data.group} onChange={(e) => setData('group', e.target.value)}>
                    <option value="academic">একাডেমিক</option>
                    <option value="skills">স্কিলস</option>
                </Select>
            </Field>
            <Field label="নাম" htmlFor={`name-${initial?.id || 'new'}`} error={errors.name} className="sm:col-span-2">
                <Input id={`name-${initial?.id || 'new'}`} value={data.name} onChange={(e) => setData('name', e.target.value)} invalid={!!errors.name} required />
            </Field>
            <Field label="ট্যাগলাইন" htmlFor={`tagline-${initial?.id || 'new'}`} error={errors.tagline} className="sm:col-span-3">
                <Input id={`tagline-${initial?.id || 'new'}`} value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} />
            </Field>
            {data.group === 'academic' && (
                <>
                    <Field label="কোন ক্লাস থেকে" htmlFor={`cmin-${initial?.id || 'new'}`} error={errors.class_min}>
                        <Input id={`cmin-${initial?.id || 'new'}`} type="number" min="1" max="12" value={data.class_min} onChange={(e) => setData('class_min', e.target.value)} />
                    </Field>
                    <Field label="কোন ক্লাস পর্যন্ত" htmlFor={`cmax-${initial?.id || 'new'}`} error={errors.class_max}>
                        <Input id={`cmax-${initial?.id || 'new'}`} type="number" min="1" max="12" value={data.class_max} onChange={(e) => setData('class_max', e.target.value)} />
                    </Field>
                </>
            )}
            <Field label="ক্রম" htmlFor={`sort-${initial?.id || 'new'}`} error={errors.sort_order}>
                <Input id={`sort-${initial?.id || 'new'}`} type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
            </Field>
            <div className="flex items-end gap-2 sm:col-span-2">
                <Button type="submit" disabled={processing}>{submitLabel}</Button>
                {onDone && <Button variant="ghost" onClick={onDone}>বাতিল</Button>}
            </div>
        </form>
    );
}

export default function Index({ categories }) {
    const [editing, setEditing] = useState(null);

    const destroy = (cat) => {
        if (cat.courses_count > 0) return;
        if (window.confirm(`“${cat.name}” মুছে ফেলবেন?`)) router.delete(`/admin/categories/${cat.id}`, { preserveScroll: true });
    };

    const groups = [
        { key: 'academic', label: 'একাডেমিক' },
        { key: 'skills', label: 'স্কিলস' },
    ];

    return (
        <AdminLayout title="ক্যাটাগরি">
            <Head title="ক্যাটাগরি" />

            <section className="card-surface p-5 sm:p-6">
                <h2 className="text-sm font-bold text-ink">নতুন ক্যাটাগরি যোগ করুন</h2>
                <p className="mb-4 mt-1 text-[13px] text-ink-2">ক্লাস রেঞ্জ দেওয়া একাডেমিক ক্যাটাগরি ল্যান্ডিং পেজের ক্লাস ১-১২ পিকারে দেখা যায়।</p>
                <CategoryForm submitLabel="ক্যাটাগরি যোগ করুন" />
            </section>

            {groups.map((g) => (
                <section key={g.key} className="card-surface mt-6 overflow-hidden">
                    <h2 className="border-b border-line px-5 py-4 text-sm font-bold text-ink">{g.label}</h2>
                    <ul className="divide-y divide-line">
                        {categories.filter((c) => c.group === g.key).map((cat) => (
                            <li key={cat.id} className="px-5 py-4">
                                {editing === cat.id ? (
                                    <CategoryForm initial={cat} submitLabel="সংরক্ষণ" onDone={() => setEditing(null)} />
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-ink">
                                                {cat.name}
                                                {cat.class_min && <span className="ml-2 text-[12px] font-medium text-ink-3">ক্লাস {bn(cat.class_min)}{cat.class_max !== cat.class_min ? `-${bn(cat.class_max)}` : ''}</span>}
                                            </p>
                                            <p className="truncate text-[13px] text-ink-2">{cat.tagline || `/courses?category=${cat.slug}`}</p>
                                        </div>
                                        <span className="text-[13px] text-ink-3">{number(cat.courses_count)}টি কোর্স</span>
                                        <button type="button" onClick={() => setEditing(cat.id)} className="rounded-full p-2 text-ink-2 hover:bg-surface-3 hover:text-ink" aria-label={`${cat.name} এডিট`}><PencilSimple size={18} /></button>
                                        <button type="button" onClick={() => destroy(cat)} disabled={cat.courses_count > 0} title={cat.courses_count > 0 ? 'আগে এর কোর্সগুলো সরান' : 'মুছুন'} className="rounded-full p-2 text-ink-2 hover:bg-surface-3 hover:text-brand-600 disabled:opacity-30" aria-label={`${cat.name} মুছুন`}><Trash size={18} /></button>
                                    </div>
                                )}
                            </li>
                        ))}
                        {categories.filter((c) => c.group === g.key).length === 0 && (
                            <li className="px-5 py-8 text-center text-sm text-ink-2">এখনো কোনো {g.label} ক্যাটাগরি নেই।</li>
                        )}
                    </ul>
                </section>
            ))}
        </AdminLayout>
    );
}
