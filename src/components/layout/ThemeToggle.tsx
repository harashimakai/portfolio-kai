import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <div
      className="theme-toggle"
      data-cursor={darkMode ? "Light mode" : "Dark mode"}
      data-cursor-filled
    >
      <h2>
        <span aria-hidden="true">{darkMode ? "◑" : "◐"}</span>
        {showLabel && (
          <span className="theme-toggle-label">
            {darkMode ? "Light mode" : "Dark mode"}
          </span>
        )}
      </h2>
      <button
        id="mode-switch"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
      />
    </div>
  );
}
