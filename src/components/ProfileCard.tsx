import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Avatar from "./Avatar";
import ElectricBorder from "./effects/ElectricBorder";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useCopy } from "../features/theme/copy";
import { fetchNetwork, involvesUser } from "../features/network/networkSlice";
import AddExperienceModal from "../features/profile/AddExperienceModal";
import { fetchExperiences } from "../features/profile/profileSlice";

function ProfileCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  const mode = useAppSelector((state) => state.theme.mode);
  const connections = useAppSelector((state) => state.network.connections);
  const experiences = useAppSelector((state) => state.profile.experiences);
  const copy = useCopy();
  const [showAddExperience, setShowAddExperience] = useState(false);

  // Carica i collegamenti per mostrare il conteggio vero
  useEffect(() => {
    dispatch(fetchNetwork());
  }, [dispatch]);

  // Carica le esperienze dell'utente loggato: la card compare in più pagine
  // (Home, Lavoro, ...) quindi le tiene sempre sincronizzate da qui.
  useEffect(() => {
    if (user) dispatch(fetchExperiences(user.id));
  }, [dispatch, user]);

  if (!user) return null;

  const connectionCount = connections.filter(
    (c) => c.status === "accepted" && involvesUser(c, String(user.id)),
  ).length;

  const card = (
    <div className="bg-body rounded-2 border overflow-hidden">
      <div className="bg-primary-subtle" style={{ height: 64 }} />

      <Link
        to="/profile"
        className="d-block px-3 pb-3 text-decoration-none text-body cursor-target"
      >
        <div style={{ marginTop: -44 }}>
          <Avatar
            src={user.avatar}
            name={user.name}
            surname={user.surname}
            size={80}
            ringed
          />
        </div>
        <div className="fw-bold fs-5 mt-2">
          {user.name} {user.surname}
        </div>
        <div className="text-secondary small">{user.headline}</div>
        <div className="text-secondary small">{user.location}</div>
      </Link>

      <div className="px-3 pb-3">
        <Button
          variant="outline-secondary"
          size="sm"
          className="rounded-1"
          style={{ borderStyle: "dashed" }}
          onClick={() => setShowAddExperience(true)}
        >
          + Esperienza
        </Button>

        {experiences.length > 0 && (
          <div className="mt-2">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-top pt-2 mt-2">
                <div className="fw-semibold small">{exp.role}</div>
                <div className="text-secondary small">
                  {exp.company} · {exp.period}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="m-0" />

      <Link
        to="/network"
        className="d-block px-3 py-2 text-decoration-none text-body cursor-target"
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

  const modal = (
    <AddExperienceModal
      show={showAddExperience}
      onClose={() => setShowAddExperience(false)}
    />
  );

  if (brandTheme === "cyberpunk") {
    return (
      <>
        <ElectricBorder
          color={mode === "dark" ? "#9d00ff" : "#ff6600"}
          borderRadius={8}
          chaos={0.2}
          speed={1.4}
        >
          {card}
        </ElectricBorder>
        {modal}
      </>
    );
  }

  return (
    <>
      {card}
      {modal}
    </>
  );
}

export default ProfileCard;
