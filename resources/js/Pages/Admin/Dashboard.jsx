import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, CursorClick } from '@phosphor-icons/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import CourseImage from '@/Components/CourseImage';
import { StatTile } from '@/Components/Form';
import { number, taka, bn } from '@/lib/format';

/* Single-series bar chart of daily clicks. One color, one metric; axis labels every 5 days. */
function ClicksChart({ series }) {
    const max = Math.max(1, ...series.map((d) => d.clicks));
    const w = 600;
    const h = 180;
    const pad = { l: 28, r: 4, t: 8, b: 22 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    const bw = iw / series.length;
    const ticks = [0, Math.ceil(max / 2), max];

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="দৈনিক ক্লিক, গত ৩০ দিন">
            {ticks.map((t) => {
                const y = pad.t + ih - (t / max) * ih;
                return (
                    <g key={t}>
                        <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
                        <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="10" fill="var(--ink-3)">{bn(t)}</text>
                    </g>
                );
            })}
            {series.map((d, i) => {
                const bh = (d.clicks / max) * ih;
                const x = pad.l + i * bw + bw * 0.2;
                const y = pad.t + ih - bh;
                const label = new Date(d.day + 'T00:00:00').toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
                return (
                    <g key={d.day}>
                        <rect x={x} y={y} width={bw * 0.6} height={bh} rx="2" fill="var(--color-brand-600)" opacity={d.clicks ? 1 : 0.25}>
                            <title>{`${label}: ${bn(d.clicks)} ক্লিক`}</title>
                        </rect>
                        {(i % 5 === 0 || i === series.length - 1) && (
                            <text x={x + bw * 0.3} y={h - 6} textAnchor="middle" fontSize="10" fill="var(--ink-3)">{label}</text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

export default function Dashboard({ stats, series, topCourses, recentClicks }) {
    const delta = stats.clicks_prev_7d === 0 ? null : Math.round(((stats.clicks_7d - stats.clicks_prev_7d) / stats.clicks_prev_7d) * 100);
    const deltaLabel = delta === null ? `আগের সপ্তাহে ${number(stats.clicks_prev_7d)}` : `আগের ৭ দিনের তুলনায় ${delta >= 0 ? '+' : ''}${bn(delta)}%`;

    return (
        <AdminLayout title="ড্যাশবোর্ড" actions={<Button href="/admin/courses/create" size="sm">কোর্স যোগ করুন</Button>}>
            <Head title="ড্যাশবোর্ড" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile label="ক্লিক, গত ৭ দিন" value={number(stats.clicks_7d)} sub={deltaLabel} tone={delta === null ? null : delta >= 0 ? 'up' : 'down'} />
                <StatTile label="ক্লিক, মোট" value={number(stats.clicks_total)} sub={`আজ ${number(stats.clicks_today)}`} />
                <StatTile label="সেলস, গত ৩০ দিন" value={number(stats.sales_30d)} sub={`মোট ${number(stats.sales_total)}`} />
                <StatTile label="কমিশন, গত ৩০ দিন" value={taka(stats.commission_30d)} sub={`মোট ${taka(stats.commission_total)}`} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <section className="card-surface p-5 xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-ink">দৈনিক ক্লিক</h2>
                        <span className="text-[13px] text-ink-3">গত ৩০ দিন</span>
                    </div>
                    <div className="mt-4">
                        {stats.clicks_total === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-line-2 px-6 py-12 text-center">
                                <CursorClick size={28} className="text-ink-3" />
                                <p className="mt-3 text-sm font-semibold text-ink">এখনো কোনো ক্লিক হয়নি</p>
                                <p className="mt-1 max-w-xs text-[13px] text-ink-2">কেউ ভর্তি বাটনে ক্লিক করলেই এখানে দেখা যাবে।</p>
                            </div>
                        ) : (
                            <ClicksChart series={series} />
                        )}
                    </div>
                </section>

                <section className="card-surface p-5">
                    <h2 className="text-base font-bold text-ink">সাম্প্রতিক ক্লিক</h2>
                    {recentClicks.length === 0 ? (
                        <p className="mt-3 text-sm text-ink-2">এখনো কিছু নেই।</p>
                    ) : (
                        <ul className="mt-3 divide-y divide-line">
                            {recentClicks.map((c) => (
                                <li key={c.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                                    <div className="min-w-0">
                                        <Link href={`/admin/courses/${c.course_id}/edit`} className="line-clamp-1 font-semibold text-ink hover:text-brand-600">{c.course || 'মুছে ফেলা কোর্স'}</Link>
                                        {c.referer && <p className="truncate text-[12px] text-ink-3">{c.referer} থেকে</p>}
                                    </div>
                                    <span className="shrink-0 text-[12px] text-ink-3">{bn(c.at)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <section className="card-surface mt-6 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                    <h2 className="text-base font-bold text-ink">টপ কোর্স</h2>
                    <Link href="/admin/courses" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink">সব কোর্স <ArrowUpRight size={14} /></Link>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-y border-line bg-surface-3 text-left text-[13px] font-semibold text-ink-3">
                        <tr>
                            <th className="px-5 py-2.5">কোর্স</th>
                            <th className="px-3 py-2.5 text-right">৩০ দিন</th>
                            <th className="px-3 py-2.5 text-right">মোট</th>
                            <th className="px-5 py-2.5 text-right">সেলস</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {topCourses.map((c) => (
                            <tr key={c.id} className="hover:bg-surface-3/60">
                                <td className="px-5 py-3">
                                    <Link href={`/admin/courses/${c.id}/edit`} className="flex items-center gap-3">
                                        <CourseImage src={c.image_url} alt="" className="w-16 shrink-0 rounded-md" />
                                        <span className="line-clamp-2 font-semibold text-ink">{c.title}</span>
                                    </Link>
                                </td>
                                <td className="px-3 py-3 text-right font-semibold text-ink">{number(c.clicks_30d)}</td>
                                <td className="px-3 py-3 text-right text-ink-2">{number(c.clicks_count)}</td>
                                <td className="px-5 py-3 text-right text-ink-2">{number(c.sales_count)}</td>
                            </tr>
                        ))}
                        {topCourses.length === 0 && (
                            <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-ink-2">শুরু করতে একটি কোর্স যোগ করুন।</td></tr>
                        )}
                    </tbody>
                </table>
            </section>
        </AdminLayout>
    );
}
