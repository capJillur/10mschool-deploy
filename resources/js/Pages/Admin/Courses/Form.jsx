import { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowUpRight, Image as ImageIcon, Trash, UploadSimple, X } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import { Field, Input, Select, Textarea, Toggle } from '@/Components/Form';
import { number, bn } from '@/lib/format';

export default function Form({ course, categories }) {
    const editing = Boolean(course);
    const { data, setData, post, processing, errors, isDirty, transform } = useForm({
        title: course?.title || '',
        slug: course?.slug || '',
        category_id: course?.category_id || categories[0]?.id || '',
        instructor: course?.instructor || '',
        badge: course?.badge || '',
        description: course?.description || '',
        highlights: (course?.highlights || []).join('\n'),
        affiliate_url: course?.affiliate_url || '',
        price: course?.price ?? '',
        original_price: course?.original_price ?? '',
        is_free: course?.is_free || false,
        is_featured: course?.is_featured || false,
        is_published: course?.is_published ?? true,
        sort_order: course?.sort_order ?? 0,
        image_url: '',
        image_file: null,
        remove_image: false,
    });

    const [preview, setPreview] = useState(course?.image_url || null);
    const [imageMode, setImageMode] = useState('upload');

    useEffect(() => {
        if (!data.image_file) return undefined;
        const url = URL.createObjectURL(data.image_file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.image_file]);

    useEffect(() => {
        if (imageMode === 'url' && data.image_url) setPreview(data.image_url);
    }, [data.image_url, imageMode]);

    const grouped = useMemo(() => ({
        academic: categories.filter((c) => c.group === 'academic'),
        skills: categories.filter((c) => c.group === 'skills'),
    }), [categories]);

    const submit = (e) => {
        e.preventDefault();
        transform((d) => ({ ...d, _method: editing ? 'put' : 'post' }));
        post(editing ? `/admin/courses/${course.id}` : '/admin/courses', { forceFormData: true, preserveScroll: true });
    };

    const destroy = () => {
        if (window.confirm(`“${course.title}” মুছে ফেলবেন? এর ক্লিক হিস্ট্রিও মুছে যাবে।`)) {
            router.delete(`/admin/courses/${course.id}`);
        }
    };

    const clearImage = () => {
        setPreview(null);
        setData((d) => ({ ...d, image_file: null, image_url: '', remove_image: true }));
    };

    return (
        <AdminLayout
            title={editing ? 'কোর্স এডিট' : 'নতুন কোর্স'}
            actions={
                editing && course.is_published ? (
                    <a href={`/courses/${course.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold text-ink hover:bg-surface-3">
                        পেজ দেখুন <ArrowUpRight size={14} />
                    </a>
                ) : null
            }
        >
            <Head title={editing ? `এডিট: ${course.title}` : 'নতুন কোর্স'} />

            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <section className="card-surface space-y-5 p-5 sm:p-6">
                        <Field label="কোর্সের নাম" htmlFor="title" error={errors.title}>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} invalid={!!errors.title} placeholder="যেমন: IELTS Course" required />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="ইন্সট্রাক্টর" htmlFor="instructor" error={errors.instructor}>
                                <Input id="instructor" value={data.instructor} onChange={(e) => setData('instructor', e.target.value)} placeholder="যেমন: Munzereen Shahid" />
                            </Field>
                            <Field label="ব্যাজ" htmlFor="badge" hint="কার্ডে দেখানো ছোট লেবেল, যেমন লাইভ ব্যাচ বা বেস্ট সেলার" error={errors.badge}>
                                <Input id="badge" value={data.badge} onChange={(e) => setData('badge', e.target.value)} maxLength={40} />
                            </Field>
                        </div>
                        <Field label="অ্যাফিলিয়েট লিংক" htmlFor="affiliate_url" hint="affiliation.10minuteschool.com থেকে পাওয়া আপনার ট্র্যাকড লিংক। ভর্তি বাটনে ক্লিক করলে ভিজিটর এখানে যাবে।" error={errors.affiliate_url}>
                            <Input id="affiliate_url" type="url" value={data.affiliate_url} onChange={(e) => setData('affiliate_url', e.target.value)} invalid={!!errors.affiliate_url} placeholder="https://10minuteschool.com/product/..." required />
                        </Field>
                        <Field label="বিবরণ" htmlFor="description" hint="সাধারণ টেক্সট। প্যারাগ্রাফের মাঝে একটি খালি লাইন রাখুন।" error={errors.description}>
                            <Textarea id="description" rows={7} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </Field>
                        <Field label="কোর্সে যা পাবেন" htmlFor="highlights" hint="প্রতি লাইনে একটি পয়েন্ট, সর্বোচ্চ ১২টি।" error={errors.highlights || errors['highlights.0']}>
                            <Textarea id="highlights" rows={5} value={data.highlights} onChange={(e) => setData('highlights', e.target.value)} placeholder={'প্রতি সপ্তাহে লাইভ ক্লাস\nলেকচার শিট\nসার্টিফিকেট'} />
                        </Field>
                    </section>

                    <section className="card-surface p-5 sm:p-6">
                        <h2 className="text-sm font-bold text-ink">দাম</h2>
                        <div className="mt-4 grid gap-5 sm:grid-cols-3">
                            <Field label="দাম (৳)" htmlFor="price" error={errors.price}>
                                <Input id="price" type="number" min="0" step="1" inputMode="numeric" value={data.price} disabled={data.is_free} onChange={(e) => setData('price', e.target.value)} placeholder="3500" />
                            </Field>
                            <Field label="আগের দাম (৳)" htmlFor="original_price" hint="কেটে দেখানো হবে" error={errors.original_price}>
                                <Input id="original_price" type="number" min="0" step="1" inputMode="numeric" value={data.original_price} disabled={data.is_free} onChange={(e) => setData('original_price', e.target.value)} placeholder="5000" />
                            </Field>
                            <div className="sm:pt-7">
                                <Toggle label="ফ্রি কোর্স" checked={data.is_free} onChange={(v) => setData('is_free', v)} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="card-surface p-5">
                        <h2 className="text-sm font-bold text-ink">ছবি</h2>
                        <div className="mt-3 overflow-hidden rounded-input border border-line bg-surface-3">
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="" className="aspect-video w-full object-cover" onError={() => setPreview(null)} />
                                    <button type="button" onClick={clearImage} className="absolute right-2 top-2 rounded-full bg-stone-950/70 p-1.5 text-white hover:bg-stone-950" aria-label="ছবি সরান"><X size={14} weight="bold" /></button>
                                </div>
                            ) : (
                                <div className="flex aspect-video flex-col items-center justify-center text-ink-3">
                                    <ImageIcon size={28} />
                                    <span className="mt-1 text-[12px]">১৬:৯ সাইজ সবচেয়ে ভালো</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex gap-1 rounded-full bg-surface-3 p-1 text-[13px] font-semibold">
                            {['upload', 'url'].map((m) => (
                                <button key={m} type="button" onClick={() => setImageMode(m)} className={`flex-1 rounded-full py-1.5 ${imageMode === m ? 'bg-surface-2 text-ink shadow-card' : 'text-ink-2'}`}>
                                    {m === 'upload' ? 'আপলোড' : 'ছবির লিংক'}
                                </button>
                            ))}
                        </div>
                        {imageMode === 'upload' ? (
                            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-input border border-dashed border-line-2 px-3 py-3 text-[13px] font-semibold text-ink-2 hover:border-ink-3 hover:text-ink">
                                <UploadSimple size={16} /> {data.image_file ? data.image_file.name : 'JPG, PNG বা WebP বেছে নিন'}
                                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setData((d) => ({ ...d, image_file: e.target.files?.[0] || null, image_url: '', remove_image: false }))} />
                            </label>
                        ) : (
                            <Input className="mt-3" type="url" placeholder="https://cdn.10minuteschool.com/..." value={data.image_url} onChange={(e) => setData((d) => ({ ...d, image_url: e.target.value, image_file: null, remove_image: false }))} />
                        )}
                        {(errors.image_file || errors.image_url) && <p className="mt-2 text-[13px] font-medium text-brand-600">{errors.image_file || errors.image_url}</p>}
                    </section>

                    <section className="card-surface space-y-4 p-5">
                        <Field label="ক্যাটাগরি" htmlFor="category_id" error={errors.category_id}>
                            <Select id="category_id" value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} invalid={!!errors.category_id}>
                                <optgroup label="একাডেমিক">{grouped.academic.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
                                <optgroup label="স্কিলস">{grouped.skills.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
                            </Select>
                        </Field>
                        <Toggle label="প্রকাশিত" description="সাইটে দেখা যাবে" checked={data.is_published} onChange={(v) => setData('is_published', v)} />
                        <Toggle label="ফিচার্ড" description="ল্যান্ডিং পেজের ফিচার্ড অংশে দেখানো হবে" checked={data.is_featured} onChange={(v) => setData('is_featured', v)} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="ক্রম" htmlFor="sort_order" hint="কম সংখ্যা আগে আসে" error={errors.sort_order}>
                                <Input id="sort_order" type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                            </Field>
                            <Field label="URL স্লাগ" htmlFor="slug" hint="খালি রাখলে নাম থেকে তৈরি হবে" error={errors.slug}>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} invalid={!!errors.slug} placeholder="ielts-course" />
                            </Field>
                        </div>
                    </section>

                    {editing && (
                        <section className="card-surface p-5 text-[13px] text-ink-2">
                            <p><span className="font-semibold text-ink">{number(course.clicks_count)}</span>টি ক্লিক ও <span className="font-semibold text-ink">{number(course.sales_count)}</span>টি সেলস রেকর্ড করা আছে।</p>
                            <p className="mt-1">পাবলিক লিংক: <a href={`/courses/${course.slug}`} className="font-semibold text-ink underline decoration-line-2 underline-offset-2 hover:text-brand-600" target="_blank" rel="noreferrer">/courses/{course.slug}</a></p>
                        </section>
                    )}

                    <div className="sticky bottom-4 flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface-2/90 p-2 shadow-pop backdrop-blur">
                        <Button type="submit" disabled={processing} className="flex-1">{processing ? 'সংরক্ষণ হচ্ছে' : editing ? 'পরিবর্তন সংরক্ষণ করুন' : 'কোর্স তৈরি করুন'}</Button>
                        {editing ? (
                            <Button variant="danger" onClick={destroy} aria-label="কোর্স মুছুন"><Trash size={16} /></Button>
                        ) : (
                            <Button href="/admin/courses" variant="ghost">বাতিল</Button>
                        )}
                    </div>
                    {isDirty && <p className="text-center text-[12px] text-ink-3">অসংরক্ষিত পরিবর্তন আছে</p>}
                </div>
            </form>
        </AdminLayout>
    );
}
