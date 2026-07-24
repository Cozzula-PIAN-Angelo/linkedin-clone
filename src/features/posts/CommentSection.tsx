import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import Avatar from "../../components/Avatar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addComment, deleteComment } from "./postsSlice";
import { timeAgo } from "./timeAgo";
import type { Post } from "../../types";

interface CommentSectionProps {
  post: Post;
}

// Input per commentare + lista dei commenti di un post, in stile LinkedIn
function CommentSection({ post }: CommentSectionProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const authors = useAppSelector((state) => state.posts.authors);
  const comments = useAppSelector((state) =>
    state.posts.comments.filter(
      (comment) => String(comment.postId) === String(post.id)
    )
  );

  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    dispatch(addComment({ postId: String(post.id), content: text }));
    setText("");
  };

  return (
    <div className="px-3 pb-3">
      {/* Input nuovo commento */}
      {currentUser && (
        <Form onSubmit={handleSubmit} className="d-flex align-items-center gap-2 mb-3">
          <Avatar
            src={currentUser.avatar}
            name={currentUser.name}
            surname={currentUser.surname}
            size={32}
          />
          <Form.Control
            type="text"
            placeholder="Aggiungi un commento…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-pill"
            size="sm"
          />
          {text.trim() !== "" && (
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="rounded-pill flex-shrink-0 cursor-target"
            >
              Pubblica
            </Button>
          )}
        </Form>
      )}

      {/* Lista commenti */}
      <div className="d-flex flex-column gap-2">
        {comments.map((comment) => {
          const author = authors.find(
            (user) => String(user.id) === String(comment.authorId)
          );
          const isOwnComment =
            currentUser !== null &&
            String(currentUser.id) === String(comment.authorId);

          return (
            <div key={String(comment.id)} className="d-flex gap-2">
              <Avatar
                src={author?.avatar}
                name={author?.name ?? "?"}
                surname={author?.surname ?? "?"}
                size={32}
              />
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="bg-body-secondary rounded-3 px-3 py-2">
                  <div className="d-flex justify-content-between align-items-baseline gap-2">
                    <span className="fw-semibold small text-truncate">
                      {author ? `${author.name} ${author.surname}` : "Utente eliminato"}
                    </span>
                    <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {author?.headline && (
                    <div
                      className="text-secondary text-truncate"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {author.headline}
                    </div>
                  )}
                  <div className="small mt-1" style={{ whiteSpace: "pre-wrap" }}>
                    {comment.content}
                  </div>
                </div>

                {isOwnComment && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => dispatch(deleteComment(String(comment.id)))}
                    className="text-decoration-none text-secondary p-0 mt-1 cursor-target"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Trash size={12} className="me-1" />
                    Elimina
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommentSection;
