import { useState } from 'react';
import { GraduationCap } from '@phosphor-icons/react';
import { cx } from '@/lib/format';

/* 16:9 thumbnail with a skeleton while loading and a quiet fallback if the image is missing. */
export default function CourseImage({ src, alt, className, sizes, priority = false }) {
    const [state, setState] = useState(src ? 'loading' : 'empty');

    return (
        <div className={cx('relative aspect-video overflow-hidden bg-surface-3', !/\bw-/.test(className || '') && 'w-full', className)}>
            {state === 'loading' && <div className="skeleton absolute inset-0" aria-hidden="true" />}
            {src && state !== 'error' ? (
                <img
                    src={src}
                    alt={alt}
                    sizes={sizes}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    decoding="async"
                    onLoad={() => setState('loaded')}
                    onError={() => setState('error')}
                    className={cx(
                        'h-full w-full object-cover transition-opacity duration-500',
                        state === 'loaded' ? 'opacity-100' : 'opacity-0',
                    )}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink-3">
                    <GraduationCap size={36} weight="duotone" />
                </div>
            )}
        </div>
    );
}
