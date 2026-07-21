import { Grid3x3GapFill, List, ThreeDots } from "react-bootstrap-icons";
import Avatar from "../Avatar";
import { mockUsers } from "../../mockData";

function NavbarActions() {
  const currentUser = mockUsers[0];

  return (
    <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
      <button
        type="button"
        className="btn btn-light d-sm-none rounded-circle p-2"
        aria-label="Altro"
      >
        <List size={20} />
      </button>

      <Avatar
        src={currentUser.avatar}
        name={currentUser.name}
        surname={currentUser.surname}
      />

      <Grid3x3GapFill size={20} className="d-none d-md-block text-secondary" />

      <ThreeDots size={20} className="d-sm-none text-secondary" />
    </div>
  );
}

export default NavbarActions;
