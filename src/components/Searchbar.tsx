import { Search } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";

// Nessuna prop di ricerca (onSearch/value) per ora: solo layout, verrà aggiunta quando si integra la ricerca reale
function SearchBar() {
  return (
    <>
      <button
        type="button"
        className="btn btn-light d-lg-none rounded-circle p-2"
        aria-label="Cerca"
      >
        <Search size={18} />
      </button>
      <Form className="d-none d-lg-block" style={{ maxWidth: 280 }}>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <Search />
          </span>
          <Form.Control
            type="search"
            placeholder="Cerca"
            className="bg-light border-0"
          />
        </div>
      </Form>
    </>
  );
}
export default SearchBar;
