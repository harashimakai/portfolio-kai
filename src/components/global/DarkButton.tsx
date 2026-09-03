interface Props {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DarkButton({ darkMode, setDarkMode }: Props) {
  return (
    <div className="theme-toggle">
      <h2>{darkMode ? "◑" : "◐"}</h2>
      <button
        id="mode-switch"
        onClick={() => setDarkMode(!darkMode)}
      />
    </div>
  );
}
