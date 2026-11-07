import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ThemeValue {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

const STORAGE_KEY = "theme";
const SWITCH_MS = 950;
let switchTimer = 0;

const systemDark = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

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
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
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

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
