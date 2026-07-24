import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { ChatDotsFill, CircleFill, SendFill, Trash } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchAIReply,
  resetChat,
  sendMessage,
  setActiveContact,
} from "../features/messaging/data/messagingSlice";

// Pagina messaggistica a schermo intero, stile LinkedIn: lista conversazioni
// a sinistra, chat aperta a destra. Usa lo stesso slice Redux del pannello in
// basso a destra (MessagingDrawer), quindi i due restano sincronizzati e la
// logica del bot AI (fetchAIReply verso Groq) è riusata così com'è.
function MessagingPage() {
  const dispatch = useAppDispatch();
  const { contacts, activeContactId, isTyping } = useAppSelector(
    (state) => state.messaging,
  );
  const activeContact = contacts.find((c) => c.id === activeContactId);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scorre in fondo a ogni nuovo messaggio o quando il contatto "sta digitando"
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !activeContactId) return;
    dispatch(sendMessage({ contactId: activeContactId, text }));
    setInputText("");
    dispatch(fetchAIReply({ contactId: activeContactId, userMessage: text }));
  };

  return (
    <Container style={{ paddingTop: 68 }} className="pb-3">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <Card className="border overflow-hidden" style={{ height: "80vh" }}>
            <Row className="g-0 h-100">
              {/* Colonna sinistra: elenco conversazioni */}
              <Col xs={12} md={4} className="border-end h-100 d-flex flex-column">
                <div className="p-3 border-bottom fw-semibold d-flex align-items-center gap-2">
                  <ChatDotsFill className="text-primary" />
                  Messaggi
                </div>
                <div className="flex-grow-1 overflow-auto">
                  {contacts.map((contact) => {
                    const lastMsg = contact.messages[contact.messages.length - 1];
                    const isActive = contact.id === activeContactId;
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => dispatch(setActiveContact(contact.id))}
                        className={`w-100 border-0 text-start d-flex align-items-center gap-2 p-3 border-bottom ${
                          isActive ? "bg-primary bg-opacity-10" : "bg-transparent"
                        }`}
                      >
                        <div className="position-relative flex-shrink-0">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="rounded-circle"
                            style={{ width: 48, height: 48, objectFit: "cover" }}
                          />
                          {contact.online && (
                            <CircleFill
                              size={11}
                              className="text-success position-absolute bottom-0 end-0 border border-2 border-white rounded-circle"
                            />
                          )}
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="fw-semibold text-truncate">
                            {contact.name}
                          </div>
                          <div className="text-secondary small text-truncate">
                            {lastMsg ? lastMsg.text : contact.role}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Col>

              {/* Colonna destra: conversazione attiva */}
              <Col xs={12} md={8} className="h-100 d-flex flex-column">
                {activeContact ? (
                  <>
                    <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={activeContact.avatar}
                          alt={activeContact.name}
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <div>
                          <div className="fw-semibold">{activeContact.name}</div>
                          <div className="text-secondary small">
                            {activeContact.role}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="text-secondary p-1"
                        title="Svuota la conversazione"
                        onClick={() => dispatch(resetChat(activeContact.id))}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>

                    <div
                      className="flex-grow-1 overflow-auto p-3 bg-body-secondary"
                      style={{ minHeight: 0 }}
                    >
                      {activeContact.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`d-flex flex-column mb-2 ${
                            msg.sender === "user"
                              ? "align-items-end"
                              : "align-items-start"
                          }`}
                        >
                          <div
                            className={`px-3 py-2 rounded-4 ${
                              msg.sender === "user"
                                ? "bg-primary text-white"
                                : "bg-body border"
                            }`}
                            style={{ maxWidth: "75%" }}
                          >
                            {msg.text}
                          </div>
                          <span className="text-secondary mt-1" style={{ fontSize: "0.7rem" }}>
                            {msg.timestamp}
                          </span>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="text-secondary fst-italic small px-1">
                          {activeContact.name} sta digitando…
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <Form
                      onSubmit={handleSend}
                      className="p-2 border-top d-flex gap-2 align-items-center"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Scrivi un messaggio…"
                        className="rounded-pill"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 40, height: 40 }}
                      >
                        <SendFill size={16} />
                      </Button>
                    </Form>
                  </>
                ) : (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-secondary p-4 text-center">
                    <ChatDotsFill size={40} className="mb-2 opacity-50" />
                    <p className="mb-0">
                      Seleziona una conversazione per iniziare a chattare.
                    </p>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MessagingPage;
