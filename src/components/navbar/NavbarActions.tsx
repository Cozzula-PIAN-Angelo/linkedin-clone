import { useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import {
  BinocularsFill,
  BoxArrowRight,
  Fire,
  MoonStarsFill,
  PersonFill,
  Radioactive,
  SunFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, deleteAccount } from "../../features/auth/authSlice";
import { toggleTheme } from "../../features/theme/themeSlice";
import { useCopy } from "../../features/theme/copy";

function NavbarActions() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const theme = useAppSelector((state) => state.theme.mode);
  const copy = useCopy();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await dispatch(deleteAccount()).unwrap();
      // account eliminato: ProtectedRoute reindirizza da solo a /login
    } catch (err) {
      setDeleteError(
        typeof err === "string" ? err : "Errore durante l'eliminazione",
      );
      setDeleting(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
      <button
        type="button"
        className="btn btn-light d-sm-none rounded-circle d-flex align-items-center justify-content-center p-2 cursor-target"
        aria-label="Altro"
      >
        <Radioactive size={20} />
      </button>

      <button
        type="button"
        className="btn p-2 border-0 bg-transparent text-body cursor-target"
        aria-label="Cambia tema"
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === "light" ? (
          <MoonStarsFill size={18} />
        ) : (
          <SunFill size={18} />
        )}
      </button>

      <BinocularsFill size={20} className="d-none d-md-block text-secondary" />

      <ThreeDots size={20} className="d-sm-none text-secondary" />

      {currentUser && (
        <>
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="d-flex align-items-center gap-1 rounded-pill p-1 pe-2 cursor-target"
              id="user-menu"
              aria-label="Menu utente"
            >
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                surname={currentUser.surname}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                {currentUser.name} {currentUser.surname}
                <br />
                <small className="text-muted">{currentUser.email}</small>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/profile">
                <PersonFill className="me-2" />
                Vedi profilo
              </Dropdown.Item>
              <Dropdown.Item onClick={() => logoutUser()}>
                <BoxArrowRight className="me-2" />
                {copy.userMenu.logout}
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={() => setShowConfirm(true)}
              >
                <Fire className="me-2" />
                {copy.userMenu.deleteAccount}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Modal
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title className="h6">
                {copy.deleteModal.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {copy.deleteModal.bodyBefore}
              <b>{currentUser.email}</b>
              {copy.deleteModal.bodyAfter}
              {deleteError && (
                <div className="text-danger small mt-2">{deleteError}</div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                {copy.deleteModal.cancel}
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? copy.deleteModal.confirming : copy.deleteModal.confirm}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}

export default NavbarActions;
