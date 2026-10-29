import { Link } from "react-router-dom";


import NavButton from "./NavButton";
import DarkButton from "./DarkButton";
import Monogram from "./Monogram";

type NavbarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <div className="navbar-logos">
            <Monogram />
          </div>
        </Link>
      </div>
              <div className="navbar-controls">
          <div className="navbar-nav">
            <NavButton
              to="/"
              label="HOME"
            />
            <NavButton
              to="/work"
              label="WORK"
              alsoActive={["/putmeon"]}
            />
            <NavButton
              to="/art"
              label="ART"
            />
            <NavButton
              to="/about"
              label="ABOUT"
            />
          </div>
          <DarkButton
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>
    </nav>
  );
}
