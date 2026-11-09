import { Link } from "react-router-dom";

import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import Monogram from "../ui/Monogram";

// Navbar

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link
        to="/"
        className="navbar-logo"
        aria-label="Home"
      >
        <Monogram />
      </Link>
      <div className="navbar-controls">
        <div className="navbar-links">
          <NavLinks />
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
