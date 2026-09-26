import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';

/* Transient toast for server flash messages. */
export default function Flash() {
    const { flash } = usePage().props;
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (flash?.success) setMsg({ type: 'success', text: flash.success, id: Date.now() });
        else if (flash?.error) setMsg({ type: 'error', text: flash.error, id: Date.now() });
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (!msg) return undefined;
        const t = setTimeout(() => setMsg(null), 4000);
        return () => clearTimeout(t);
    }, [msg]);

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
            <AnimatePresence>
                {msg && (
                    <motion.div
                        key={msg.id}
                        role="status"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-surface-2 py-2 pl-3 pr-2 text-sm font-medium text-ink shadow-pop"
                    >
                        {msg.type === 'success' ? (
                            <CheckCircle size={18} weight="fill" className="text-emerald-500" />
                        ) : (
                            <WarningCircle size={18} weight="fill" className="text-brand-600" />
                        )}
                        <span>{msg.text}</span>
                        <button type="button" onClick={() => setMsg(null)} className="rounded-full p-1 text-ink-3 hover:bg-surface-3 hover:text-ink" aria-label="বন্ধ করুন">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
