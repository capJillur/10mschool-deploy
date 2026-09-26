import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { number } from '@/lib/format';

/* Counts up once when the number first becomes visible. Writes to the DOM directly, no re-renders. */
export default function CountUp({ value, className }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
    const reduce = useReducedMotion();

    useEffect(() => {
        if (!inView || !ref.current) return undefined;
        if (reduce) {
            ref.current.textContent = number(value);
            return undefined;
        }
        const controls = animate(0, value, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                if (ref.current) ref.current.textContent = number(Math.round(v));
            },
        });
        return () => controls.stop();
    }, [inView, value, reduce]);

    return <span ref={ref} className={className}>{number(reduce ? value : 0)}</span>;
}
