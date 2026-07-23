import { useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../features/posts/postsSlice";
import PostCard from "../features/posts/PostCard";

// Pagina di un singolo post: è la destinazione del link condiviso con "Invia"
function PostPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const post = useAppSelector((state) =>
    state.posts.items.find((p) => String(p.id) === String(id))
  );
  const author = useAppSelector((state) =>
    post
      ? state.posts.authors.find((u) => String(u.id) === String(post.authorId))
      : undefined
  );
  const loading = useAppSelector((state) => state.posts.loading);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <Container style={{ paddingTop: 68 }}>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={7}>
          {post ? (
            <PostCard post={post} author={author} />
          ) : loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="bg-body rounded-2 border p-4 text-center">
              <p className="text-secondary mb-2">
                Questo post non esiste più, oppure era un contenuto
                dimostrativo andato perso al ricaricamento.
              </p>
              <Link to="/">Torna al feed</Link>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default PostPage;
