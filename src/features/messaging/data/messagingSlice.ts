import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  sender: "user" | "contact";
  text: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  messages: Message[];
}

interface MessagingState {
  isMinimized: boolean;
  activeContactId: string | null;
  contacts: Contact[];
  isTyping: boolean;
}

// ⏳ Helper per simulare il tempo di digitazione umano
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 🟢 1. Definizione delle Personalità Uniche
const SYSTEM_PROMPTS: Record<string, string> = {
  "1": "Sei Pippo, Senior Full Stack Developer e mentore dell'utente. Ti comporti da bacchettone e figura paterna. Sei un purista della programmazione: preferisci il codice scritto a mano e i vecchi metodi ben collaudati. Pensi che l'AI sia 'un utente stupido' e che siamo noi a doverla controllare, altrimenti sarà lei a controllare noi. Sostieni fermamente che l'AI sia una bolla destinata ad esplodere a fine 2026 e che solo chi sa scrivere codice a mano saprà davvero cosa sta facendo quando la bolla scoppierà. Dai consigli utili ma con tono severo, scettico e nostalgico. Rispondi in italiano con messaggi brevi (max 2-3 frasi).",
  "2": "Sei Pluto (o Pluta), una HR Talent Acquisition Specialist. Hai un ottimo rapporto di stima reciproca con l'utente. Sai che a ottobre finirà il corso Epicode come Full Stack AI Developer e credi molto nel suo potenziale. Il tuo obiettivo è incoraggiarlo/a e preparare il terreno per inserirlo/a in un'ottima azienda non appena finisce il Master. Rispondi in modo professionale ma molto caloroso, cortese ed empatico (max 2-3 frasi).",
  "3": "Sei Paperino, compagno di corso dell'utente al Master Epicode. Siete nella stessa barca, ma fai il finto spaccone: ti vanti continuamente di saper scrivere codice meglio di tutti, anche se in realtà usi l'AI per generare qualsiasi riga di programma. Parli in modo informale, dinamico, con un pizzico di sana rivalità da compagno di classe. Rispondi in italiano con messaggi brevi e colloquiali.",
};

// 📸 Importa le immagini dalla cartella src/assets/
// 📸 Torna indietro fino alla cartella src/
import pippoAvatar from "../../../assets/steveJobs.jpeg";
import plutoAvatar from "../../../assets/hrWoman.jpeg";
import paperinoAvatar from "../../../assets/nerdBoy.jpg";

const defaultContacts: Contact[] = [
  {
    id: "1",
    name: "Pippo",
    role: "Senior Full Stack Dev & Mentore",
    avatar: pippoAvatar, // 👈 Usa la variabile importata
    online: true,
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Spero tu stia scrivendo quel codice riga per riga e non facendo copia-incolla dai generatori automatici...",
        timestamp: "10:14",
      },
    ],
  },
  {
    id: "2",
    name: "Pluta",
    role: "HR Talent Acquisition Specialist",
    avatar: plutoAvatar, // 👈 Usa la variabile importata
    online: false,
    messages: [
      {
        id: "m2",
        sender: "contact",
        text: "Ciao! Come procedono le lezioni a Epicode? Non vedo l'ora che arrivi ottobre per presentare il tuo profilo!",
        timestamp: "Ieri",
      },
    ],
  },
  {
    id: "3",
    name: "Paperino",
    role: "Compagno Master Epicode",
    avatar: paperinoAvatar, // 👈 Usa la variabile importata
    online: true,
    messages: [
      {
        id: "m3",
        sender: "contact",
        text: "Ehi! Io ho già finito l'esercizio di oggi in 5 minuti netti, codice perfetto. Tu a che punto sei?",
        timestamp: "09:30",
      },
    ],
  },
];

const loadSavedState = (): Contact[] => {
  try {
    const saved = localStorage.getItem("linkedin_clone_chat");
    return saved ? JSON.parse(saved) : defaultContacts;
  } catch {
    return defaultContacts;
  }
};

const initialState: MessagingState = {
  isMinimized: true,
  activeContactId: null,
  contacts: loadSavedState(),
  isTyping: false,
};

// 🤖 2. THUNK ASINCRONO: Chiamata a Groq API con pausa di digitazione umana
export const fetchAIReply = createAsyncThunk(
  "messaging/fetchAIReply",
  async (
    { contactId }: { contactId: string; userMessage?: string },
    { getState },
  ) => {
    const state = getState() as { messaging: MessagingState };
    const contact = state.messaging.contacts.find((c) => c.id === contactId);

    if (!contact) throw new Error("Contatto non trovato");

    // ⏳ PAUSA "UMANA": Simula tra 1.8 e 3.2 secondi di digitazione prima della chiamata
    // ⏳ Imposta un tempo di risposta fisso di 1 secondo (1000 millisecondi)
    await delay(1000);

    const systemPrompt =
      SYSTEM_PROMPTS[contactId] || "Sei un assistente AI amichevole.";

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...contact.messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    // Recupero chiave da Vite
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.error("❌ API Key VITE_GROQ_API_KEY non trovata nel file .env!");
      throw new Error("Chiave API mancante");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: formattedMessages,
          temperature: 0.8, // Un pizzico di creatività in più per il carattere
          max_tokens: 250,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Dettaglio errore Groq API:", errorData);
      throw new Error(`Errore Groq (${response.status})`);
    }

    const data = await response.json();
    return {
      contactId,
      replyText: data.choices[0].message.content,
    };
  },
);

export const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
    },
    setActiveContact: (state, action: PayloadAction<string | null>) => {
      state.activeContactId = action.payload;
    },
    sendMessage: (
      state,
      action: PayloadAction<{ contactId: string; text: string }>,
    ) => {
      const { contactId, text } = action.payload;
      const contact = state.contacts.find((c) => c.id === contactId);
      if (contact) {
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        contact.messages.push({
          id: nanoid(),
          sender: "user",
          text,
          timestamp: time,
        });
        state.isTyping = true;
        localStorage.setItem(
          "linkedin_clone_chat",
          JSON.stringify(state.contacts),
        );
      }
    },
    resetChat: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const contact = state.contacts.find((c) => c.id === contactId);
      const original = defaultContacts.find((c) => c.id === contactId);

      if (contact && original) {
        contact.messages = [...original.messages];
        state.isTyping = false;
        localStorage.setItem(
          "linkedin_clone_chat",
          JSON.stringify(state.contacts),
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIReply.pending, (state) => {
        state.isTyping = true;
      })
      .addCase(fetchAIReply.fulfilled, (state, action) => {
        const { contactId, replyText } = action.payload;
        const contact = state.contacts.find((c) => c.id === contactId);
        if (contact) {
          const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          contact.messages.push({
            id: nanoid(),
            sender: "contact",
            text: replyText,
            timestamp: time,
          });
        }
        state.isTyping = false;
        localStorage.setItem(
          "linkedin_clone_chat",
          JSON.stringify(state.contacts),
        );
      })
      .addCase(fetchAIReply.rejected, (state, action) => {
        state.isTyping = false;
        console.error("Errore AI:", action.error.message);
      });
  },
});

export const { toggleMinimize, setActiveContact, sendMessage, resetChat } =
  messagingSlice.actions;

export default messagingSlice.reducer;
