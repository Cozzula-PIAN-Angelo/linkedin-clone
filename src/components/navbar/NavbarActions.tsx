import {
  Grid3x3GapFill,
  List,
  ThreeDots,
  MoonStarsFill,
  SunFill,
} from "react-bootstrap-icons";
import Avatar from "../Avatar";
import { mockUsers } from "../../mockData";
import { toggleTheme } from "../../features/theme/themeSlice";
import type { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";

function NavbarActions() {
  const currentUser = mockUsers[0];
  const dispatch = useAppDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
      <button
        type="button"
        className="btn btn-light d-sm-none rounded-circle p-2"
        aria-label="Altro"
      >
        <List size={20} />
      </button>

      <button
        type="button"
        className="btn p-2 border-0 bg-transparent text-body"
        aria-label="Cambia tema"
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === "light" ? (
          <MoonStarsFill size={18} />
        ) : (
          <SunFill size={18} />
        )}
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
