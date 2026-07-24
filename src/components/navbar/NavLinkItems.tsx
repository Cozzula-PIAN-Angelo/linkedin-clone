import { NavLink } from "react-router-dom";
import type { IconComponent } from "../../features/theme/themeConfig";

type NavLinkItemProps = {
  to: string;
  label: string;
  icon: IconComponent;
  className?: string;
};

function NavLinkItem({
  to,
  label,
  icon: IconComponent,
  className = "",
}: NavLinkItemProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `nav-link-item d-flex flex-column align-items-center text-decoration-none px-2 ${
          isActive ? "active text-body" : "text-secondary"
        } ${className}`
      }
    >
      <span className="mt-1 d-flex">
        <IconComponent size={20} />
      </span>
      <span
        className="d-none d-lg-inline"
        style={{ fontSize: "0.72rem" }}
      >
        {label}
      </span>
    </NavLink>
  );
}

export default NavLinkItem;
