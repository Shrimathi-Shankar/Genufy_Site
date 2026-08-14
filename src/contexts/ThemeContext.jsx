'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggle: () => {}, mounted: false });

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Light theme disabled - site is dark-only for now.
  // const [theme, setTheme] = useState('light');
  // useEffect(() => {
  //   setMounted(true);
  //   try {
  //     const stored = localStorage.getItem('gf-theme');
  //     const initial = (stored === 'light' || stored === 'dark') ? stored : 'light';
  //     setTheme(initial);
  //     document.documentElement.setAttribute('data-theme', initial);
  //   } catch (_) {}
  // }, []);
  //
  // const toggle = () => {
  //   const next = theme === 'dark' ? 'light' : 'dark';
  //   setTheme(next);
  //   try { localStorage.setItem('gf-theme', next); } catch (_) {}
  //   document.documentElement.setAttribute('data-theme', next);
  // };
  const toggle = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
