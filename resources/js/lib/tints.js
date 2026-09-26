/* Secondary tint system. Keys match Banner::ACCENTS on the server. */
export const TINTS = {
    rose: { bg: 'bg-rose', ink: 'text-rose-ink', label: 'লাল' },
    sun: { bg: 'bg-sun', ink: 'text-sun-ink', label: 'হলুদ' },
    sky: { bg: 'bg-sky', ink: 'text-sky-ink', label: 'নীল' },
    mint: { bg: 'bg-mint', ink: 'text-mint-ink', label: 'সবুজ' },
    berry: { bg: 'bg-berry', ink: 'text-berry-ink', label: 'বেগুনি' },
};

export const TINT_ORDER = ['sun', 'sky', 'mint', 'berry', 'rose'];

export function tintAt(i) {
    return TINTS[TINT_ORDER[i % TINT_ORDER.length]];
}
