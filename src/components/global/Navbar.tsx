import { Link } from "react-router-dom";
import { putmeon } from "../individual/StudyData";

import monogram from "../../assets/logos/monogram.svg";
import monograml from "../../assets/logos/monogram-light.svg";
import monogramla from "../../assets/logos/monograml-accent.svg";
import monogramda from "../../assets/logos/monogramd-accent.svg";

import NavButton from "./NavButton";
import DarkButton from "./DarkButton";

type NavbarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  caseStudy?: boolean;
};

export default function Navbar({
  darkMode,
  setDarkMode,
  caseStudy = false,
}: NavbarProps) {
  return (
    <nav
      className={`navbar ${caseStudy ? "case-nav" : ""}`}
      style={putmeon.theme as React.CSSProperties}
    >
      {caseStudy && (
        <div className="navbar-controls">
          <div className="navbar-nav">
            <NavButton
              to="/"
              label="← BACK TO WORKS"
            />
          </div>
        </div>
      )}
      <div className="navbar-brand">
        <Link to="/">
          <div className="navbar-logos">
            <img
              src={monogram}
              alt="Logo"
              className="monogram m-light"
            />
            <img
              src={monograml}
              alt="Logo"
              className="monogram m-dark"
            />
            <img
              src={monogramla}
              alt="Logo"
              className="monogram m-light-accent"
            />
            <img
              src={monogramda}
              alt="Logo"
              className="monogram m-dark-accent"
            />
          </div>
        </Link>
      </div>
      {!caseStudy && (
        <div className="navbar-controls">
          <div className="navbar-nav">
            <NavButton
              to="/"
              label="HOME"
            />
            <NavButton
              to="/work"
              label="WORK"
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
      )}
    </nav>
  );
}
