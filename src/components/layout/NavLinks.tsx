import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../data/site";

// Nav links

export default function NavLinks() {
  const { pathname } = useLocation();
  return (
    <>
      {NAV_ITEMS.map(({ to, label, alsoActive = [] }) => {
        const extra = alsoActive.some(
          (p) => pathname === p || pathname.startsWith(`${p}/`),
        );
        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive || extra
                ? "nav-link underline-hover is-active"
                : "nav-link underline-hover"
            }
          >
            <span className="text-label">{label}</span>
          </NavLink>
        );
      })}
    </>
  );
}
