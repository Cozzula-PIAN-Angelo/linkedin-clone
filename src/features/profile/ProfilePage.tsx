import { useEffect } from "react";
import { Container, Card, Row, Col, Button, Spinner } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import RoleForm from "./RoleForm";
import Experencies from "./Experiences";
import { addExperience, fetchExperiences } from "./profileSlice";
import Posts from "./Posts";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts } from "../posts/postsSlice";
import {
  acceptRequest,
  fetchNetwork,
  involvesUser,
  removeConnection,
  sendRequest,
} from "../network/networkSlice";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Senza :id nella route la pagina mostra il profilo dell'utente loggato
  const { id } = useParams();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const authors = useAppSelector((state) => state.posts.authors);
  const allPosts = useAppSelector((state) => state.posts.items);
  const loading = useAppSelector((state) => state.posts.loading);
  const connections = useAppSelector((state) => state.network.connections);
  const experiences = useAppSelector((state) => state.profile.experiences);
  const loadingExperiences = useAppSelector(
    (state) => state.profile.loadingExperiences
  );

  const isOwnProfile = !id || String(id) === String(currentUser?.id);
  // Id del profilo mostrato: serve fuori dagli hook per caricare le esperienze
  const profileId = isOwnProfile ? currentUser?.id : id;

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchNetwork());
  }, [dispatch]);

  // Le esperienze si ricaricano ogni volta che cambia il profilo aperto
  useEffect(() => {
    if (profileId) {
      dispatch(fetchExperiences(String(profileId)));
    }
  }, [dispatch, profileId]);

  // Gli altri profili (anche gli utenti finti) si pescano dagli autori del feed
  const user = isOwnProfile
    ? currentUser
    : authors.find((author) => String(author.id) === String(id));

  if (!user) {
    // Feed ancora in caricamento, id inesistente o autore eliminato da db.json
    return (
      <Container className="text-center" style={{ paddingTop: 68 }}>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <p className="text-secondary">Utente non trovato.</p>
        )}
      </Container>
    );
  }

  const userPosts = allPosts.filter(
    (post) => String(post.authorId) === String(user.id)
  );

  // Il rapporto tra me e questo profilo (richiesta in corso o collegamento)
  const connection = isOwnProfile
    ? undefined
    : connections.find(
        (c) =>
          involvesUser(c, String(currentUser?.id)) &&
          involvesUser(c, String(user.id))
      );
  const isRequestReceived =
    connection?.status === "pending" &&
    String(connection.addresseeId) === String(currentUser?.id);

  const editProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <>
      <Container style={{ paddingTop: 68 }}>
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <Card className="profile-card bg-white rounded-2 border">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    surname={user.surname}
                    size={120}
                  />
                </div>
                <Card.Title>
                  {user.name} {user.surname}
                </Card.Title>
                <Card.Subtitle className="text-secondary mb-2">
                  {user.headline}
                </Card.Subtitle>
                {isOwnProfile ? (
                  <Button
                    onClick={editProfile}
                    className="bg-white text-primary "
                  >
                    Modifica profilo
                  </Button>
                ) : !connection ? (
                  <Button
                    className="rounded-pill"
                    onClick={() => dispatch(sendRequest(String(user.id)))}
                  >
                    Collegati
                  </Button>
                ) : isRequestReceived ? (
                  <Button
                    className="rounded-pill"
                    onClick={() => dispatch(acceptRequest(connection))}
                  >
                    Accetta invito
                  </Button>
                ) : connection.status === "pending" ? (
                  <Button
                    variant="outline-secondary"
                    className="rounded-pill"
                    onClick={() =>
                      dispatch(removeConnection(String(connection.id)))
                    }
                  >
                    In attesa
                  </Button>
                ) : (
                  <Button
                    variant="outline-primary"
                    className="rounded-pill"
                    onClick={() =>
                      dispatch(removeConnection(String(connection.id)))
                    }
                  >
                    Collegato ✓
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {isOwnProfile && (
        <Container className="mt-3">
          <Row className="justify-content-center">
            <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
              <RoleForm onAdd={(exp) => dispatch(addExperience(exp))} />
            </Col>
          </Row>
        </Container>
      )}

      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <Experencies
              experiences={experiences}
              canEdit={isOwnProfile}
              loading={loadingExperiences}
            />
          </Col>
        </Row>
      </Container>

      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <Posts posts={userPosts} user={user} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProfilePage;
