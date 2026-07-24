import { useMemo, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import { useAppSelector } from "../../app/hooks";
import { useCopy } from "../../features/theme/copy";
import type { User } from "../../types";

// Sotto questa lunghezza non si cerca: con una lettera sola uscirebbero tutti
const MIN_QUERY = 2;
const MAX_RESULTS = 6;

function SearchBar() {
  const copy = useCopy();
  // Le persone cercabili sono quelle già in memoria: gli utenti veri caricati
  // dalla rete e gli autori del feed (che comprendono anche quelli finti)
  const networkUsers = useAppSelector((state) => state.network.users);
  const authors = useAppSelector((state) => state.posts.authors);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < MIN_QUERY) return [];

    const everyone = new Map<string, User>();
    networkUsers.forEach((user) => everyone.set(String(user.id), user));
    authors.forEach((user) => {
      if (!everyone.has(String(user.id))) everyone.set(String(user.id), user);
    });

    return [...everyone.values()]
      .filter((user) => {
        const nome = `${user.name} ${user.surname}`.toLowerCase();
        return nome.includes(q) || (user.headline ?? "").toLowerCase().includes(q);
      })
      .slice(0, MAX_RESULTS);
  }, [query, networkUsers, authors]);

  const chiudi = () => {
    setQuery("");
    setOpen(false);
  };

  const mostraTendina = open && query.trim().length >= MIN_QUERY;

  return (
    <>
      <button
        type="button"
        className="btn btn-light d-lg-none rounded-circle d-flex align-items-center justify-content-center p-2 cursor-target"
        aria-label="Cerca"
      >
        <Search size={18} />
      </button>
      <Form
        className="d-none d-lg-block position-relative"
        style={{ maxWidth: 280 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="input-group">
          <span className="input-group-text bg-body-secondary border-0">
            <Search />
          </span>
          <Form.Control
            type="search"
            placeholder={copy.searchPlaceholder}
            className="bg-body-secondary border-0"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
        </div>

        {mostraTendina && (
          <div
            className="position-absolute bg-body border rounded-2 shadow-sm w-100 mt-1 list-group list-group-flush"
            style={{ zIndex: 1030, overflow: "hidden" }}
          >
            {results.length === 0 ? (
              <div className="text-secondary small px-3 py-2">
                Nessuna persona trovata.
              </div>
            ) : (
              results.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="list-group-item list-group-item-action d-flex align-items-center gap-2 px-3 py-2 text-decoration-none cursor-target"
                  // Impedisce che il campo perda il fuoco prima del click,
                  // altrimenti onBlur chiuderebbe la tendina e il link
                  // non verrebbe mai premuto
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={chiudi}
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    surname={user.surname}
                    size={32}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="small fw-semibold text-truncate">
                      {user.name} {user.surname}
                    </div>
                    {user.headline && (
                      <div className="text-secondary text-truncate" style={{ fontSize: "0.75rem" }}>
                        {user.headline}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </Form>
    </>
  );
}

export default SearchBar;
