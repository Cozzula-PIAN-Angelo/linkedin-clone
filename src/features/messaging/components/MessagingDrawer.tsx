import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import {
  ChevronUp,
  ChevronDown,
  Send,
  ChatDotsFill,
  ArrowLeft,
  CircleFill,
  Trash,
} from "react-bootstrap-icons";
import type { RootState, AppDispatch } from "../../../app/store";
import {
  toggleMinimize,
  setActiveContact,
  sendMessage,
  resetChat,
  fetchAIReply, // 👈 Sostituisci receiveReply con fetchAIReply
} from "../data/messagingSlice";

export default function MessagingDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const { isMinimized, activeContactId, contacts, isTyping } = useSelector(
    (state: RootState) => state.messaging,
  );
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeContactId);

  // Auto-scroll fluido sempre attivo ad ogni nuovo messaggio o stato "sta digitando"
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeContactId) return;

    // 1. Salva il messaggio dell'utente in Redux
    dispatch(sendMessage({ contactId: activeContactId, text }));
    if (!textToSend) setInputText("");

    // 2. Invia la richiesta all'AI Groq/Llama 3
    dispatch(fetchAIReply({ contactId: activeContactId, userMessage: text }));
  };
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);

  return (
    <div
      className="position-fixed bottom-0 z-3"
      style={{
        width: "340px",
        right: "max(20px, calc((100vw - 1140px) / 2))",
        borderRadius: "18px 18px 0 0",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        backgroundColor: "rgba(255, 255, 255, 0.82)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
      }}
    >
      {/* 🟢 BARRA SUPERIORE (HEADER) */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom cursor-target"
        style={{
          cursor: "pointer",
          backgroundColor: "rgba(248, 249, 250, 0.6)",
          borderColor: "rgba(0,0,0,0.06)",
        }}
        onClick={() => dispatch(toggleMinimize())}
      >
        <div className="d-flex align-items-center gap-2">
          {activeContact && !isMinimized ? (
            <button
              className="btn btn-link p-0 text-dark border-0 me-1 cursor-target"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setActiveContact(null));
              }}
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <ChatDotsFill size={16} className="text-primary" />
          )}

          <span
            className="fw-semibold text-dark"
            style={{ fontSize: "0.88rem" }}
          >
            {activeContact && !isMinimized ? activeContact.name : "Messaggi"}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 text-secondary opacity-75">
          {/* Tasto Reset Chat: visibile solo se siamo dentro una chat attiva */}
          {activeContact && !isMinimized && (
            <button
              className="btn btn-link p-0 text-secondary border-0 hover-text-danger cursor-target"
              title="Reset e svuota chat"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(resetChat(activeContact.id));
              }}
            >
              <Trash size={14} />
            </button>
          )}
          {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* 🟢 CORPO DEL DRAWER */}
      {!isMinimized && (
        <div style={{ height: "400px" }} className="d-flex flex-column">
          {/* VISTA 1: LISTA CONTATTI */}
          {!activeContact ? (
            <div className="overflow-auto flex-grow-1 p-2">
              {contacts.map((contact) => {
                const lastMsg = contact.messages[contact.messages.length - 1];
                return (
                  <div
                    key={contact.id}
                    onClick={() => dispatch(setActiveContact(contact.id))}
                    className="d-flex align-items-center gap-2 p-2 rounded-3 mb-1 cursor-target"
                    style={{
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0,0,0,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <div className="position-relative">
                      {contact.avatar ? (
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="rounded-circle object-fit-cover"
                          width="42"
                          height="42"
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: "42px",
                            height: "42px",
                            fontSize: "0.85rem",
                          }}
                        >
                          {getInitials(contact.name)}
                        </div>
                      )}
                      {contact.online && (
                        <CircleFill
                          size={10}
                          className="text-success position-absolute bottom-0 end-0 border border-2 border-white rounded-circle"
                        />
                      )}
                    </div>

                    <div
                      className="flex-grow-1 overflow-hidden"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-dark">
                          {contact.name}
                        </span>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.68rem" }}
                        >
                          {lastMsg?.timestamp}
                        </span>
                      </div>
                      <div
                        className="text-muted text-truncate"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {lastMsg ? lastMsg.text : contact.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VISTA 2: CHAT CON SINGOLO CONTATTO */
            <div className="d-flex flex-column flex-grow-1 h-100 overflow-hidden">
              {/* Messaggi con scroll Y e altezza flessibile */}
              <div
                className="flex-grow-1 p-3 overflow-y-auto"
                style={{
                  fontSize: "0.82rem",
                  backgroundColor: "rgba(245,247,250,0.5)",
                  maxHeight: "280px",
                }}
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
                      className="px-3 py-2 rounded-4"
                      style={{
                        maxWidth: "80%",
                        backgroundColor:
                          msg.sender === "user"
                            ? "#007AFF"
                            : "rgba(255, 255, 255, 0.95)",
                        color: msg.sender === "user" ? "#fff" : "#1d1d1f",
                        boxShadow:
                          msg.sender === "user"
                            ? "0 2px 8px rgba(0,122,255,0.25)"
                            : "0 1px 4px rgba(0,0,0,0.06)",
                        border:
                          msg.sender === "user"
                            ? "none"
                            : "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      {msg.text}
                    </div>
                    <span
                      className="text-muted mt-1 px-1"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div
                    className="text-muted fst-italic px-2 mb-2"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {activeContact.name} sta digitando...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Form Input Messaggio */}
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-2 border-top d-flex gap-2 align-items-center mt-auto"
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Scrivi un messaggio..."
                  className="rounded-pill border-0 px-3 py-1 shadow-none"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    fontSize: "0.8rem",
                  }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0 cursor-target"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#007AFF",
                    border: "none",
                  }}
                >
                  <Send size={12} />
                </button>
              </Form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
