import { Nav } from "react-bootstrap";
import {
  Bell,
  BriefcaseFill,
  ChatDotsFill,
  HouseDoorFill,
  List,
  PeopleFill,
} from "react-bootstrap-icons";
import NavLinkItem from "./NavLinkItems";

const links = [
  { to: "/", label: "Home", icon: HouseDoorFill },
  { to: "/network", label: "Il mio network", icon: PeopleFill },
  { to: "/jobs", label: "Lavoro", icon: BriefcaseFill },
  { to: "/messaging", label: "Messaggistica", icon: ChatDotsFill },
  { to: "/notifications", label: "Notifiche", icon: Bell },
  { to: "/more", label: "Altro", icon: List },
];

function NavLinks() {
  return (
    <Nav className="d-none d-sm-flex flex-row flex-grow-1 justify-content-center gap-1 gap-md-2">
      {links.map((link) => (
        <NavLinkItem key={link.to} {...link} />
      ))}
    </Nav>
  );
}

export default NavLinks;
