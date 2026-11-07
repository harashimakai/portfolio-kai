import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <div
      className="theme-toggle"
      data-cursor={darkMode ? "Light mode" : "Dark mode"}
      data-cursor-filled
    >
      <h2>{darkMode ? "◑" : "◐"}</h2>
      <button
        id="mode-switch"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
      />
    </div>
  );
}
