import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const getStoredTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('manadesign-theme') as Theme | null;
    return stored || 'light';
  };

  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  const isDarkTheme = (t: Theme) => {
    if (typeof window === 'undefined') return false;
    if (t === 'dark') return true;
    if (t === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [isDark, setIsDark] = useState<boolean>(() => isDarkTheme(getStoredTheme()));

  const applyTheme = useCallback((currentTheme: Theme) => {
    if (typeof window === 'undefined') return;
    const dark = isDarkTheme(currentTheme);
    setIsDark(dark);

    const root = document.documentElement;
    const body = document.body;

    if (dark) {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
    }

    localStorage.setItem('manadesign-theme', currentTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    const handleCustomThemeChange = (e: any) => {
      if (e.detail && e.detail !== theme) {
        setThemeState(e.detail);
        applyTheme(e.detail);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    window.addEventListener('manadesign-theme-changed', handleCustomThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('manadesign-theme-changed', handleCustomThemeChange);
    };
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('manadesign-theme-changed', { detail: newTheme }));
    }
  }, [applyTheme]);

  const toggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return { theme, isDark, toggle, setTheme };
}
