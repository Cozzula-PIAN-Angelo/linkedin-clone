import { useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts } from "./postsSlice";
import { useDummyActivity } from "./useDummyActivity";
import PostComposer from "./PostComposer";
import PostCard from "./PostCard";

// Il feed centrale della home: composer in alto e lista dei post sotto
function Feed() {
  const dispatch = useAppDispatch();
  const { items, authors, loading, error } = useAppSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Attività finta da DummyJSON: post, like e commenti di utenti fasulli
  useDummyActivity();

  return (
    <div className="d-flex flex-column gap-2">
      <PostComposer />

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" />
        </div>
      )}

      {error && (
        <Alert variant="warning" className="mb-0">
          {error}
        </Alert>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-body rounded-2 border p-3 text-secondary text-center">
          Ancora nessun post: pubblica tu il primo!
        </div>
      )}

      {items.map((post) => (
        <PostCard
          key={String(post.id)}
          post={post}
          author={authors.find(
            (user) => String(user.id) === String(post.authorId)
          )}
        />
      ))}
    </div>
  );
}

export default Feed;
