interface Props {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DarkButton({ darkMode, setDarkMode }: Props) {
  return (
    <div className="dark-mode-button">
      <div className="underline-hover">
        <h1>{darkMode ? "◑ LIGHT" : "◐ DARK"}</h1>
      </div>
      <button
        id="mode-switch"
        onClick={() => setDarkMode(!darkMode)}
      ></button>
    </div>
  );
}
