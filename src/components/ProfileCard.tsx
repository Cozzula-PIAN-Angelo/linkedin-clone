import Avatar from "./Avatar";
import ElectricBorder from "./effects/ElectricBorder";
import { useAppSelector } from "../app/hooks";
import { useCopy } from "../features/theme/copy";

function ProfileCard() {
  const user = useAppSelector((state) => state.auth.currentUser);
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  const mode = useAppSelector((state) => state.theme.mode);
  const copy = useCopy();

  if (!user) return null;

  const card = (
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
        <div className="small">{copy.profile.connections}</div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-secondary small">
            {copy.profile.growNetwork}
          </span>
          <span className="fw-semibold small">0</span>
        </div>
      </div>
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
