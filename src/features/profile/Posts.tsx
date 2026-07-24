import type { Post } from "../../types";
import type { User } from "../../types";
import { Card } from "react-bootstrap";

interface PostsProps {
  posts: Post[];
  user: User;
}

function Posts({ posts, user }: PostsProps) {
  if (posts.length === 0) {
    return (
      <>
        <h2>Post Pubblicati</h2>
        <Card className="bg-white rounded-2 border">
          <Card.Body className="mb-3">
            <Card.Subtitle className="text-center text-secondary">
              Questo utente non ha ancora pubblicato nulla.
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </>
    );
  }

  return (
    <>
      <h2 className="fs-5">Post Pubblicati</h2>
      <Card className="bg-white rounded-2 border">
        {posts.map((post) => (
          <Card.Body key={post.id}>
            <div className="d-flex">
              <img
                src={user.avatar}
                alt={`${user.name} ${user.surname}`}
                className="post-avatar rounded-circle mb-3 me-2"
              />
              <div>
                <Card.Title className="fw-semibold fs-6">
                  {user.name} {user.surname}
                </Card.Title>
                <Card.Subtitle className="post-sub text-secondary mb-2">
                  {user.job.map((job) => job.title).join("| ")}
                </Card.Subtitle>
                <Card.Subtitle className="post-sub text-secondary mb-2">
                  {new Date(post.createdAt).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Card.Subtitle>
              </div>
            </div>

            <Card.Text className="mb-0">{post.content}</Card.Text>
          </Card.Body>
        ))}
      </Card>
    </>
  );
}

export default Posts;
