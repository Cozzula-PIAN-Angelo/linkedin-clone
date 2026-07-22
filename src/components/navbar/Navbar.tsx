import { Link } from "react-router-dom";
import { Container, Navbar as BsNavbar } from "react-bootstrap";
import SearchBar from "./Searchbar";
import NavLinks from "./NavLinks";
import NavbarActions from "./NavbarActions";

function Navbar() {
  return (
    <BsNavbar bg="white" fixed="top" className="border-bottom py-1">
      <Container className="align-items-center px-2 px-md-3">
        <BsNavbar.Brand as={Link} to="/" className="p-0 me-2">
          <div
            className="bg-primary rounded-1 d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: 34, height: 34, fontSize: "1.1rem" }}
          >
            in
          </div>
        </BsNavbar.Brand>

        <SearchBar />
        <NavLinks />
        <NavbarActions />
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
