import { motion, useReducedMotion } from 'motion/react';

/* Scroll-entry reveal. Communicates reading order: sections arrive as the reader reaches them. */
export default function Reveal({ children, delay = 0, y = 20, className, as = 'div', once = true }) {
    const reduce = useReducedMotion();
    const Tag = motion[as] || motion.div;
    return (
        <Tag
            className={className}
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount: 0.2, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </Tag>
    );
}
