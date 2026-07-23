import { Nav } from "react-bootstrap";
import { HouseDoorFill } from "react-bootstrap-icons";
import NavLinkItem from "./NavLinkItems";
import { NotificationBell } from "../../features/notification";
import { useAppSelector } from "../../app/hooks";
import { themeConfigs } from "../../features/theme/themeConfig";
import { useCopy } from "../../features/theme/copy";

function NavLinks() {
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  const icons = themeConfigs[brandTheme].icons;
  const copy = useCopy();

  const links = [
    { to: "/", label: copy.nav.home, icon: HouseDoorFill },
    { to: "/network", label: copy.nav.network, icon: icons.network },
    { to: "/jobs", label: copy.nav.jobs, icon: icons.jobs },
    { to: "/messaging", label: copy.nav.messaging, icon: icons.messaging },
    { to: "/more", label: copy.nav.more, icon: icons.more },
  ];

  return (
    <Nav className="d-none d-sm-flex flex-row position-absolute top-50 start-50 translate-middle gap-1 gap-md-2">
      {links.slice(0, 4).map((link) => (
        <NavLinkItem key={link.to} {...link} />
      ))}
      <NotificationBell />
      {links.slice(4).map((link) => (
        <NavLinkItem key={link.to} {...link} />
      ))}
    </Nav>
  );
}

export default NavLinks;
