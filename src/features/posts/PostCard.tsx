import { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
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
import Avatar from "../../components/Avatar";
import CommentSection from "./CommentSection";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deletePost, toggleLike } from "./postsSlice";
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
        (comment) => String(comment.postId) === String(post.id)
      ).length
  );
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

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
  const authorName = author ? `${author.name} ${author.surname}` : "Utente eliminato";

  return (
    <article className="bg-body rounded-2 border">
      {/* Header: autore, headline, quanto tempo fa */}
      <div className="d-flex align-items-start gap-2 p-3 pb-2">
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

        {isOwnPost && (
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="text-secondary p-1 border-0"
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
              className="btn btn-link p-0 border-0 align-baseline text-secondary"
            >
              altro
            </button>
          </>
        )}
      </div>

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
              className="btn btn-link p-0 border-0 text-secondary small text-decoration-none"
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
          className={`text-decoration-none fw-semibold d-flex align-items-center gap-2 ${
            isLiked ? "text-primary" : "text-secondary"
          }`}
        >
          {isLiked ? <HandThumbsUpFill size={18} /> : <HandThumbsUp size={18} />}
          Consiglia
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowComments((open) => !open)}
          className="text-decoration-none text-secondary fw-semibold d-flex align-items-center gap-2"
        >
          <ChatText size={18} />
          Commenta
        </Button>
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none text-secondary fw-semibold d-flex align-items-center gap-2"
        >
          <ArrowRepeat size={18} />
          Diffondi
        </Button>
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none text-secondary fw-semibold d-flex align-items-center gap-2"
        >
          <SendFill size={18} />
          Invia
        </Button>
      </div>

      {showComments && <CommentSection post={post} />}
    </article>
  );
}

export default PostCard;
