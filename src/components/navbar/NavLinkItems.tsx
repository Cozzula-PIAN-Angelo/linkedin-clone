import { NavLink } from "react-router-dom";
import type { IconComponent } from "../../features/theme/themeConfig";

type NavLinkItemProps = {
  to: string;
  label: string;
  icon: IconComponent;
};

function NavLinkItem({ to, label, icon: IconComponent }: NavLinkItemProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `nav-link-item cursor-target d-flex flex-column align-items-center text-decoration-none px-2 ${
          isActive ? "active text-body" : "text-secondary"
        }`
      }
    >
      <IconComponent size={20} />
      <span className="d-none d-lg-inline small">{label}</span>
    </NavLink>
  );
}

export default NavLinkItem;
