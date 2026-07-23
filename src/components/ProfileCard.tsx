import { useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import ElectricBorder from "./effects/ElectricBorder";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useCopy } from "../features/theme/copy";
import { fetchNetwork, involvesUser } from "../features/network/networkSlice";

function ProfileCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  const mode = useAppSelector((state) => state.theme.mode);
  const connections = useAppSelector((state) => state.network.connections);
  const copy = useCopy();

  // Carica i collegamenti per mostrare il conteggio vero
  useEffect(() => {
    dispatch(fetchNetwork());
  }, [dispatch]);

  if (!user) return null;

  const connectionCount = connections.filter(
    (c) => c.status === "accepted" && involvesUser(c, String(user.id))
  ).length;

  const card = (
    <div className="bg-body rounded-2 border overflow-hidden">
      <div className="bg-primary-subtle" style={{ height: 56 }} />

      <Link
        to="/profile"
        className="d-block px-3 pb-3 text-decoration-none text-body"
      >
        <div style={{ marginTop: -40 }}>
          <Avatar
            src={user.avatar}
            name={user.name}
            surname={user.surname}
            size={72}
          />
        </div>
        <div className="fw-bold fs-5 mt-2">
          {user.name} {user.surname}
        </div>
        <div className="text-secondary small">{user.headline}</div>
        <div className="text-secondary small">{user.location}</div>
      </Link>

      <hr className="m-0" />

      <Link
        to="/network"
        className="d-block px-3 py-2 text-decoration-none text-body"
      >
        <div className="small">{copy.profile.connections}</div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-secondary small">
            {copy.profile.growNetwork}
          </span>
          <span className="fw-semibold small">{connectionCount}</span>
        </div>
      </Link>
    </div>
  );

  if (brandTheme === "cyberpunk") {
    return (
      <ElectricBorder
        color={mode === "dark" ? "#9d00ff" : "#ff0044"}
        borderRadius={8}
      >
        {card}
      </ElectricBorder>
    );
  }

  return card;
}

export default ProfileCard;
