import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { DARK_SCHEME_QUERY } from "../lib/media";

// Types

interface ThemeValue {
  darkMode: boolean;
  toggleTheme: () => void;
}

// Context

const ThemeContext = createContext<ThemeValue | null>(null);

// Constants

const STORAGE_KEY = "theme";
const SWITCH_MS = 950;
let switchTimer = 0;

const systemDark = () =>
  window.matchMedia?.(DARK_SCHEME_QUERY).matches ?? false;

// Provider

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? stored === "dark" : systemDark();
  });

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add("is-theme-switching");
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(
      () => root.classList.remove("is-theme-switching"),
      SWITCH_MS,
    );
    setDarkMode((prev) => {
      localStorage.setItem(STORAGE_KEY, prev ? "light" : "dark");
      return !prev;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.style.colorScheme = darkMode ? "dark" : "light";
    };
    if (!root.classList.contains("is-theme-switching")) {
      apply();
      return;
    }
    const timer = window.setTimeout(apply, SWITCH_MS);
    return () => window.clearTimeout(timer);
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia?.(DARK_SCHEME_QUERY);
    if (!mq) return;
    const follow = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) setDarkMode(e.matches);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
