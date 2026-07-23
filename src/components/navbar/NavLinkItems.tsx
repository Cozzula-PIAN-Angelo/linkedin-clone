import { Link } from "react-router-dom";
import type { IconComponent } from "../../features/theme/themeConfig";

type NavLinkItemProps = {
  to: string;
  label: string;
  icon: IconComponent;
};

function NavLinkItem({ to, label, icon: IconComponent }: NavLinkItemProps) {
  return (
    <Link
      to={to}
      className="d-flex flex-column align-items-center text-secondary text-decoration-none px-2"
    >
      <IconComponent size={20} />
      <span className="d-none d-lg-inline small">{label}</span>
    </Link>
  );
}

export default NavLinkItem;
