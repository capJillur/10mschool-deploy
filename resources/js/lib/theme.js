import { useEffect, useState } from 'react';

const KEY = '10ms-theme';

function read() {
    try {
        return localStorage.getItem(KEY) || 'light';
    } catch {
        return 'light';
    }
}

export function applyTheme(mode) {
    const root = document.documentElement;
    if (mode === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
}

export function useTheme() {
    const [mode, setMode] = useState('light');

    useEffect(() => {
        setMode(read());
    }, []);

    const set = (next) => {
        setMode(next);
        try {
            localStorage.setItem(KEY, next);
        } catch {
            /* storage unavailable */
        }
        applyTheme(next);
    };

    const isDark = mode === 'dark';

    return { mode, isDark, set, toggle: () => set(isDark ? 'light' : 'dark') };
}
