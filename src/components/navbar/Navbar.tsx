import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar as BsNavbar } from "react-bootstrap";
import SearchBar from "./Searchbar";
import NavLinks from "./NavLinks";
import NavbarActions from "./NavbarActions";
import ThemePicker from "../../features/theme/ThemePicker";
import { useAppSelector } from "../../app/hooks";
import { themeConfigs } from "../../features/theme/themeConfig";
import { useCopy } from "../../features/theme/copy";

const EASTER_EGG_CLICKS = 5;
const EASTER_EGG_WINDOW_MS = 1500;

function Navbar() {
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  const LogoIcon = themeConfigs[brandTheme].logo;
  const copy = useCopy();

  const [showThemePicker, setShowThemePicker] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, EASTER_EGG_WINDOW_MS);

    if (clickCount.current >= EASTER_EGG_CLICKS) {
      e.preventDefault();
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setShowThemePicker(true);
    }
  };

  return (
    <>
      <BsNavbar bg="body" fixed="top" className="border-bottom py-1">
        <Container
          className="position-relative align-items-center px-2 px-md-3"
          style={{ maxWidth: 1160 }}
        >
          <div className="d-flex align-items-center">
            <BsNavbar.Brand
              as={Link}
              to="/"
              className="p-0 me-2"
              aria-label={copy.brandName}
              onClick={handleLogoClick}
            >
              <div
                className="d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: 34,
                  height: 34,
                  fontSize: "1.95rem",
                  lineHeight: 1,
                  borderRadius: 3,
                  backgroundColor: themeConfigs[brandTheme].swatch,
                }}
              >
                <LogoIcon size={24} />
              </div>
            </BsNavbar.Brand>

            <SearchBar />
          </div>

          <NavLinks />
          <NavbarActions />
        </Container>
      </BsNavbar>

      <ThemePicker
        show={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />
    </>
  );
}

export default Navbar;
