import { useState, useEffect } from 'react';

type Theme = 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('ifsc-theme', theme);
  }, [theme]);

  return { theme };
}
