import Avatar from "./Avatar";
import { useAppSelector } from "../app/hooks";

function ProfileCard() {
  const user = useAppSelector((state) => state.auth.currentUser);

  if (!user) return null;

  return (
    <div className="bg-body rounded-2 border overflow-hidden">
      <div className="bg-primary-subtle" style={{ height: 56 }} />

      <div className="px-3 pb-3">
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
      </div>

      <hr className="m-0" />

      <div className="px-3 py-2">
        <div className="small">Collegamenti</div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Amplia la tua rete</span>
          <span className="fw-semibold small">0</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
