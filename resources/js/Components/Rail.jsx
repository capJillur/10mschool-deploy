import { useEffect, useRef, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cx } from '@/lib/format';

/*
  Horizontal card rail. Scrolls natively on touch and trackpad; the arrow buttons
  cover mouse users because the scrollbar is hidden. Arrows disable at each end.
*/
export function useRail() {
    const ref = useRef(null);
    const [state, setState] = useState({ start: true, end: false });

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const update = () => {
            const max = el.scrollWidth - el.clientWidth;
            setState({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
        };
        update();
        el.addEventListener('scroll', update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', update);
            ro.disconnect();
        };
    }, []);

    const step = (dir) => {
        const el = ref.current;
        if (!el) return;
        const card = el.querySelector(':scope > *');
        const amount = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
        el.scrollBy({ left: dir * amount * 2, behavior: 'smooth' });
    };

    return { ref, state, step };
}

export function RailArrows({ rail, className }) {
    const btn = 'inline-flex h-10 w-10 items-center justify-center rounded-btn border border-line bg-surface-2 text-ink transition hover:border-ink-3 hover:bg-surface-3 disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-surface-2';
    return (
        <div className={cx('flex gap-2', className)}>
            <button type="button" onClick={() => rail.step(-1)} disabled={rail.state.start} className={btn} aria-label="আগের কার্ডগুলো">
                <CaretLeft size={18} weight="bold" />
            </button>
            <button type="button" onClick={() => rail.step(1)} disabled={rail.state.end} className={btn} aria-label="পরের কার্ডগুলো">
                <CaretRight size={18} weight="bold" />
            </button>
        </div>
    );
}

export default function Rail({ rail, children, className }) {
    return (
        <div ref={rail.ref} className={cx('rail', className)}>
            {children}
        </div>
    );
}
