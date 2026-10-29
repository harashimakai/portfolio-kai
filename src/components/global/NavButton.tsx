import { NavLink, useLocation } from "react-router-dom";

interface Props {
  to: string;
  label: string;
  /* Other paths (prefixes) that also mark this tab active. */
  alsoActive?: string[];
}

export default function NavButton({ to, label, alsoActive = [] }: Props) {
  const { pathname } = useLocation();
  const extra = alsoActive.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive || extra
          ? "nav-link-active nav-link underline-hover"
          : "nav-link underline-hover"
      }
    >
      <h2>{label}</h2>
    </NavLink>
  );
}
