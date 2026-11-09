import { useTheme } from "../../context/ThemeContext";

// Theme toggle

export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <div
      className="theme-toggle"
      data-cursor={darkMode ? "Light mode" : "Dark mode"}
      data-cursor-filled
    >
      <span className="text-label">
        <span aria-hidden="true">{darkMode ? "◑" : "◐"}</span>
        {showLabel && (
          <span className="theme-toggle-label">
            {darkMode ? "Light mode" : "Dark mode"}
          </span>
        )}
      </span>
      <button
        id="mode-switch"
        type="button"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
      />
    </div>
  );
}
