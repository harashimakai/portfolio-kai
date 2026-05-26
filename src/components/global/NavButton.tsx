import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  label: string;
}

export default function NavButton({ to, label }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "nav-link-active nav-link underline-hover"
          : "nav-link underline-hover"
      }
    >
      {label}
    </NavLink>
  );
}
