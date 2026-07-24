import { useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import {
  ArrowRepeat,
  ChatText,
  Globe2,
  HandThumbsUp,
  HandThumbsUpFill,
  SendFill,
  ThreeDots,
  Trash,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import CommentSection from "./CommentSection";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deletePost, repostPost, toggleLike } from "./postsSlice";
import { timeAgo } from "./timeAgo";
import type { Post, User } from "../../types";

interface PostCardProps {
  post: Post;
  author?: User;
}

// Oltre questa lunghezza il testo viene troncato con "…altro", come su LinkedIn
const PREVIEW_LENGTH = 220;

function PostCard({ post, author }: PostCardProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const commentCount = useAppSelector(
    (state) =>
      state.posts.comments.filter(
        (comment) => String(comment.postId) === String(post.id),
      ).length,
  );
  // Se il post è una diffusione, l'originale da mostrare incorporato
  const original = useAppSelector((state) =>
    post.repostOf
      ? state.posts.items.find((p) => String(p.id) === String(post.repostOf))
      : undefined,
  );
  const originalAuthor = useAppSelector((state) =>
    original
      ? state.posts.authors.find(
          (user) => String(user.id) === String(original.authorId),
        )
      : undefined,
  );

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwnPost =
    currentUser !== null && String(currentUser.id) === String(post.authorId);
  const isLiked =
    currentUser !== null && post.likes.includes(String(currentUser.id));

  const isLong = post.content.length > PREVIEW_LENGTH;
  const visibleContent =
    isLong && !expanded
      ? post.content.slice(0, PREVIEW_LENGTH).trimEnd()
      : post.content;

  // L'autore può mancare se il suo account è stato eliminato da db.json
  const authorName = author
    ? `${author.name} ${author.surname}`
    : "Utente eliminato";

  // Link condivisibile al singolo post, usato dalla modale "Invia"
  const postUrl = `${window.location.origin}/post/${post.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
    } catch {
      // Clipboard negata dal browser: il link resta selezionabile a mano
      setCopied(false);
    }
  };

  const authorInfo = (
    <>
      <Avatar
        src={author?.avatar}
        name={author?.name ?? "?"}
        surname={author?.surname ?? "?"}
        size={48}
      />
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <div className="fw-bold text-truncate">{authorName}</div>
        {author?.headline && (
          <div className="text-secondary small text-truncate">
            {author.headline}
          </div>
        )}
        <div className="text-secondary small d-flex align-items-center gap-1">
          {timeAgo(post.createdAt)} · <Globe2 size={13} />
        </div>
      </div>
    </>
  );

  return (
    <article className="post-card bg-body rounded-2 border">
      {/* Header: autore, headline, quanto tempo fa. Avatar e nome portano
          al profilo dell'autore (nessun link se l'account è stato eliminato) */}
      <div className="d-flex align-items-start gap-2 p-3 pb-2">
        {author ? (
          <Link
            to={`/profile/${post.authorId}`}
            className="d-flex align-items-start gap-2 flex-grow-1 text-decoration-none text-body cursor-target"
            style={{ minWidth: 0 }}
          >
            {authorInfo}
          </Link>
        ) : (
          authorInfo
        )}

        {isOwnPost && (
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="text-secondary p-1 border-0 cursor-target"
              bsPrefix="btn"
              aria-label="Opzioni post"
            >
              <ThreeDots size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                className="text-danger"
                onClick={() => dispatch(deletePost(String(post.id)))}
              >
                <Trash className="me-2" />
                Elimina post
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {/* Contenuto, con troncamento "…altro" */}
      <div className="px-3 pb-2" style={{ whiteSpace: "pre-wrap" }}>
        {visibleContent}
        {isLong && !expanded && (
          <>
            {"… "}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="btn btn-link p-0 border-0 align-baseline text-secondary cursor-target"
            >
              altro
            </button>
          </>
        )}
      </div>

      {/* Post diffuso: l'originale incorporato in un riquadro */}
      {post.repostOf && (
        <div className="mx-3 mb-2 border rounded-2 p-2">
          {original ? (
            <>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Avatar
                  src={originalAuthor?.avatar}
                  name={originalAuthor?.name ?? "?"}
                  surname={originalAuthor?.surname ?? "?"}
                  size={32}
                />
                <div style={{ minWidth: 0 }}>
                  {originalAuthor ? (
                    <Link
                      to={`/profile/${original.authorId}`}
                      className="fw-bold small text-decoration-none text-body d-block text-truncate cursor-target"
                    >
                      {originalAuthor.name} {originalAuthor.surname}
                    </Link>
                  ) : (
                    <div className="fw-bold small">Utente eliminato</div>
                  )}
                  <div className="text-secondary small">
                    {timeAgo(original.createdAt)}
                  </div>
                </div>
              </div>
              <div className="small" style={{ whiteSpace: "pre-wrap" }}>
                {original.content}
              </div>
              {original.image && (
                <img
                  src={original.image}
                  alt="Contenuto del post originale"
                  className="w-100 d-block rounded-1 mt-2"
                  style={{ maxHeight: 320, objectFit: "cover" }}
                />
              )}
            </>
          ) : (
            <div className="text-secondary small text-center py-2">
              Post originale non più disponibile.
            </div>
          )}
        </div>
      )}

      {/* Immagine del post */}
      {post.image && (
        <img
          src={post.image}
          alt="Contenuto del post"
          className="w-100 d-block"
          style={{ maxHeight: 600, objectFit: "cover" }}
        />
      )}

      {/* Contatori: consigli a sinistra, commenti a destra */}
      {(post.likes.length > 0 || commentCount > 0) && (
        <div className="d-flex justify-content-between align-items-center px-3 py-1 text-secondary small">
          <span className="d-flex align-items-center gap-1">
            {post.likes.length > 0 && (
              <>
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                  style={{ width: 16, height: 16 }}
                >
                  <HandThumbsUpFill size={9} />
                </span>
                {post.likes.length}
              </>
            )}
          </span>
          {commentCount > 0 && (
            <button
              type="button"
              onClick={() => setShowComments(true)}
              className="btn btn-link p-0 border-0 text-secondary small text-decoration-none cursor-target"
            >
              {commentCount} {commentCount === 1 ? "commento" : "commenti"}
            </button>
          )}
        </div>
      )}

      <hr className="my-0 mx-3" />

      {/* Barra azioni stile LinkedIn */}
      <div className="d-flex justify-content-around py-1 px-2">
        <Button
          variant="link"
          size="sm"
          onClick={() => dispatch(toggleLike(post))}
          className={`post-action-btn text-decoration-none fw-semibold d-flex align-items-center gap-2 cursor-target ${
            isLiked ? "text-primary" : "text-secondary"
          }`}
        >
          {isLiked ? (
            <HandThumbsUpFill size={18} />
          ) : (
            <HandThumbsUp size={18} />
          )}
          Consiglia
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowComments((open) => !open)}
          className="post-action-btn text-decoration-none text-secondary fw-semibold d-flex align-items-center gap-2 cursor-target"
        >
          <ChatText size={18} />
          Commenta
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => dispatch(repostPost(post))}
          className="text-decoration-none text-secondary fw-semibold d-flex align-items-center gap-2 cursor-target"
        >
          <ArrowRepeat size={18} />
          Diffondi
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setCopied(false);
            setShowShare(true);
          }}
          className="text-decoration-none text-secondary fw-semibold d-flex align-items-center gap-2 cursor-target"
        >
          <SendFill size={18} />
          Invia
        </Button>
      </div>

      {showComments && <CommentSection post={post} />}

      {/* "Invia": condivide il post copiandone il link */}
      <Modal show={showShare} onHide={() => setShowShare(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6">Invia il post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-secondary">
            Copia il link e mandalo a chi vuoi: chi lo apre vedrà questo post.
          </p>
          <Form.Control
            type="text"
            value={postUrl}
            readOnly
            onFocus={(e) => e.target.select()}
          />
          {copied && (
            <div className="text-success small mt-2">Link copiato!</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowShare(false)}
            className="cursor-target"
          >
            Chiudi
          </Button>
          <Button onClick={copyLink} className="cursor-target">
            Copia link
          </Button>
        </Modal.Footer>
      </Modal>
    </article>
  );
}

export default PostCard;
