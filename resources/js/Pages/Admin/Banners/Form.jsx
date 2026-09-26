import { useEffect, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Trash, UploadSimple, X } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import { Field, Input, Toggle } from '@/Components/Form';
import { TINTS } from '@/lib/tints';
import { cx } from '@/lib/format';

export default function Form({ banner, accents }) {
    const editing = Boolean(banner);
    const { data, setData, post, processing, errors, transform } = useForm({
        title: banner?.title || '',
        subtitle: banner?.subtitle || '',
        cta_label: banner?.cta_label || '',
        url: banner?.url || '',
        accent: banner?.accent || 'rose',
        is_active: banner?.is_active ?? true,
        sort_order: banner?.sort_order ?? 0,
        image_url: '',
        image_file: null,
        remove_image: false,
    });
    const [preview, setPreview] = useState(banner?.image_url || null);
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

    const submit = (e) => {
        e.preventDefault();
        transform((d) => ({ ...d, _method: editing ? 'put' : 'post' }));
        post(editing ? `/admin/banners/${banner.id}` : '/admin/banners', { forceFormData: true, preserveScroll: true });
    };

    const destroy = () => {
        if (window.confirm(`“${banner.title}” ব্যানারটি মুছে ফেলবেন?`)) router.delete(`/admin/banners/${banner.id}`);
    };

    const tint = TINTS[data.accent] || TINTS.rose;

    return (
        <AdminLayout title={editing ? 'ব্যানার এডিট' : 'নতুন ব্যানার'}>
            <Head title={editing ? 'ব্যানার এডিট' : 'নতুন ব্যানার'} />
            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                    <section className="card-surface space-y-5 p-5 sm:p-6">
                        <Field label="শিরোনাম" htmlFor="title" hint="বড় করে দেখানো হবে। ছোট ও আকর্ষণীয় রাখুন।" error={errors.title}>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} invalid={!!errors.title} maxLength={120} required placeholder="ঘরে বসেই দেশসেরা শিক্ষকদের ক্লাস" />
                        </Field>
                        <Field label="সাবটাইটেল" htmlFor="subtitle" error={errors.subtitle}>
                            <Input id="subtitle" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} maxLength={200} placeholder="লাইভ ক্লাস, লেকচার শিট আর ২৪/৭ ডাউট সল্ভিং।" />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="বাটনের লেখা" htmlFor="cta_label" hint="খালি রাখলে “বিস্তারিত দেখুন”" error={errors.cta_label}>
                                <Input id="cta_label" value={data.cta_label} onChange={(e) => setData('cta_label', e.target.value)} maxLength={40} placeholder="অনলাইন ব্যাচ দেখুন" />
                            </Field>
                            <Field label="লিংক" htmlFor="url" hint="সাইটের ভেতরের পাথ (/courses?group=skills) বা পুরো লিংক" error={errors.url}>
                                <Input id="url" value={data.url} onChange={(e) => setData('url', e.target.value)} invalid={!!errors.url} required placeholder="/courses?group=academic" />
                            </Field>
                        </div>
                    </section>

                    <section className="card-surface p-5 sm:p-6">
                        <h2 className="text-sm font-bold text-ink">প্রিভিউ</h2>
                        <div className="mt-3 grid items-center gap-5 rounded-card border border-line bg-surface p-6 sm:grid-cols-2">
                            <div>
                                <p className="text-2xl font-bold text-ink">{data.title || 'শিরোনাম'}</p>
                                {data.subtitle && <p className="mt-2 text-[15px] text-ink-2">{data.subtitle}</p>}
                                <span className="mt-4 inline-flex h-10 items-center rounded-btn bg-brand-600 px-5 text-sm font-bold text-white">{data.cta_label || 'বিস্তারিত দেখুন'}</span>
                            </div>
                            <div className={cx('relative overflow-hidden rounded-xl bg-surface-2 shadow-card-hover ring-8', tint.bg.replace('bg-', 'ring-'))}>
                                {preview ? <img src={preview} alt="" className="aspect-video w-full object-cover" onError={() => setPreview(null)} /> : <div className="flex aspect-video items-center justify-center text-ink-3"><ImageIcon size={28} /></div>}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="card-surface p-5">
                        <h2 className="text-sm font-bold text-ink">ছবি</h2>
                        <p className="mt-1 text-[13px] text-ink-2">১৬:৯ ছবি সবচেয়ে ভালো দেখায়।</p>
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
                            <Input className="mt-3" type="url" placeholder="https://..." value={data.image_url} onChange={(e) => setData((d) => ({ ...d, image_url: e.target.value, image_file: null, remove_image: false }))} />
                        )}
                        {preview && (
                            <button type="button" onClick={() => { setPreview(null); setData((d) => ({ ...d, image_file: null, image_url: '', remove_image: true })); }} className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-brand-600">
                                <X size={14} weight="bold" /> ছবি সরান
                            </button>
                        )}
                        {(errors.image_file || errors.image_url) && <p className="mt-2 text-[13px] font-medium text-brand-600">{errors.image_file || errors.image_url}</p>}
                    </section>

                    <section className="card-surface space-y-4 p-5">
                        <div>
                            <p className="text-sm font-semibold text-ink">রং</p>
                            <p className="mt-0.5 text-[13px] text-ink-3">ছবির পেছনের হালকা আভা</p>
                            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="ব্যানারের রং">
                                {accents.map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        role="radio"
                                        aria-checked={data.accent === a}
                                        onClick={() => setData('accent', a)}
                                        className={cx('h-10 rounded-full px-4 text-[13px] font-bold transition-transform', TINTS[a].bg, TINTS[a].ink, data.accent === a ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface-2' : 'hover:scale-105')}
                                    >
                                        {TINTS[a].label}
                                    </button>
                                ))}
                            </div>
                            {errors.accent && <p className="mt-1 text-[13px] font-medium text-brand-600">{errors.accent}</p>}
                        </div>
                        <Toggle label="চালু" description="ল্যান্ডিং পেজে দেখানো হবে" checked={data.is_active} onChange={(v) => setData('is_active', v)} />
                        <Field label="ক্রম" htmlFor="sort_order" hint="কম সংখ্যা আগে আসে" error={errors.sort_order}>
                            <Input id="sort_order" type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                        </Field>
                    </section>

                    <div className="sticky bottom-4 flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface-2/90 p-2 shadow-pop backdrop-blur">
                        <Button type="submit" disabled={processing} className="flex-1">{processing ? 'সংরক্ষণ হচ্ছে' : editing ? 'পরিবর্তন সংরক্ষণ করুন' : 'ব্যানার তৈরি করুন'}</Button>
                        {editing ? (
                            <Button variant="danger" onClick={destroy} aria-label="ব্যানার মুছুন"><Trash size={16} /></Button>
                        ) : (
                            <Button href="/admin/banners" variant="ghost">বাতিল</Button>
                        )}
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
