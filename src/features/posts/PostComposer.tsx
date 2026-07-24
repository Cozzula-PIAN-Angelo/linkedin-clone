import { useRef, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import {
  CameraVideoFill,
  FileEarmarkTextFill,
  Globe2,
  Image as ImageIcon,
  XLg,
} from "react-bootstrap-icons";
import Avatar from "../../components/Avatar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createPost } from "./postsSlice";
import { fileToResizedDataUrl } from "./imageUtils";

// Box "Avvia un post" + modal di pubblicazione, come su LinkedIn
function PostComposer() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);
  const posting = useAppSelector((state) => state.posts.posting);

  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const openModal = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    setContent("");
    setImage(null);
    setImageError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Resetta l'input: così si può riselezionare lo stesso file dopo averlo rimosso
    e.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setImage(dataUrl);
      setImageError(null);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : "Impossibile caricare l'immagine"
      );
    }
  };

  const handlePublish = async () => {
    const result = await dispatch(
      createPost({ content, image: image ?? undefined })
    );
    if (createPost.fulfilled.match(result)) {
      closeModal();
    }
  };

  // Come su LinkedIn: si può pubblicare con solo testo, solo foto o entrambi
  const canPublish = (content.trim() !== "" || image !== null) && !posting;

  return (
    <>
      <div className="post-composer-card bg-body rounded-2 border p-3">
        <div className="d-flex align-items-center gap-2">
          <Avatar
            src={user.avatar}
            name={user.name}
            surname={user.surname}
            size={48}
          />
          <button
            type="button"
            onClick={openModal}
            className="btn border rounded-pill flex-grow-1 text-start text-secondary fw-semibold py-2 px-3"
          >
            Avvia un post
          </button>
        </div>

        <div className="d-flex justify-content-around mt-2">
          <Button
            variant="link"
            size="sm"
            onClick={openModal}
            className="text-decoration-none text-secondary fw-semibold"
          >
            <CameraVideoFill className="text-success me-2" size={18} />
            Video
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={openModal}
            className="text-decoration-none text-secondary fw-semibold"
          >
            <ImageIcon className="text-primary me-2" size={18} />
            Foto
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={openModal}
            className="text-decoration-none text-secondary fw-semibold"
          >
            <FileEarmarkTextFill className="text-warning me-2" size={18} />
            Scrivi un articolo
          </Button>
        </div>
      </div>

      <Modal show={show} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-2">
            <Avatar
              src={user.avatar}
              name={user.name}
              surname={user.surname}
              size={48}
            />
            <div>
              <div className="fw-bold">
                {user.name} {user.surname}
              </div>
              <div className="text-secondary small">
                <Globe2 className="me-1" size={14} />
                Pubblica: Chiunque
              </div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={image ? 3 : 6}
            autoFocus
            placeholder="Di cosa vorresti parlare?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-0 shadow-none fs-5"
          />

          {imageError && (
            <Alert variant="warning" className="mb-0 mt-2 py-2">
              {imageError}
            </Alert>
          )}

          {image && (
            <div className="position-relative mt-2">
              <img
                src={image}
                alt="Anteprima immagine"
                className="w-100 rounded-2 d-block"
                style={{ maxHeight: 400, objectFit: "contain" }}
              />
              <Button
                variant="dark"
                size="sm"
                onClick={() => setImage(null)}
                className="position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: 32, height: 32 }}
                aria-label="Rimuovi immagine"
              >
                <XLg size={14} />
              </Button>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-content-between">
          {/* Input file nascosto: si apre col bottone della foto */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="d-none"
          />
          <Button
            variant="link"
            onClick={() => fileInputRef.current?.click()}
            className="text-secondary p-2"
            aria-label="Aggiungi un'immagine"
            title="Aggiungi un'immagine"
          >
            <ImageIcon size={20} />
          </Button>

          <Button
            variant="primary"
            className="rounded-pill px-3"
            disabled={!canPublish}
            onClick={handlePublish}
          >
            {posting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Pubblica"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PostComposer;
