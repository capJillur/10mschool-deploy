const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/* Convert any Latin digits in a string or number to Bangla digits. */
export function bn(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export function number(value) {
    return bn(nf.format(Number(value || 0)));
}

export function taka(value) {
    if (value === null || value === undefined || value === '') return null;
    return `৳${number(value)}`;
}

export function isFree(course) {
    if (course.is_free) return true;
    if (course.price === null || course.price === undefined || course.price === '') return false;
    return Number(course.price) === 0;
}

export function priceLabel(course) {
    if (isFree(course)) return 'ফ্রি';
    if (course.price === null || course.price === undefined || course.price === '') return 'দাম দেখুন';
    return taka(course.price);
}

export function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
