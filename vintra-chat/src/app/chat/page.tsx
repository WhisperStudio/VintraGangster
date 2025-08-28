// pages/chat.tsx
"use client";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState, ChangeEvent } from "react";
import { ICONS, IconType } from "../../../components/ChatIcons";
import styles from "../../../styles/Chat.module.css";

interface Message {
  text: string;
  sender: "user" | "bot";
  icon: IconType;
}

 // ───────────────────
  // INLINE TRANSLATIONS
  const translations = {
    no: {
      placeholder:     'Skriv melding…',
      initialMessage:  'Hei! Jeg er Vintra sin AI-assistent. Hva kan jeg hjelpe deg med? PS: Du kan endre språk i innstillinger (...).',
      errorMessage:    'Noe gikk galt…',
      sendButton:      'Send',
      settingsTab:     'Innstillinger',
      infoTab:         'Info',
      settingsLang:    'Språk',
      infoHeading:     'Om Vintra-boten',
      infoText:        'Her kan du stille spørsmål om våre tjenester…',
    },
    en: {
      placeholder:     'Type a message…',
      initialMessage:   "Hello! I’m Vintra’s AI assistant. How can I help you? PS: You can change the language in settings (...).",
      errorMessage:    'Something went wrong…',
      sendButton:      'Send',
      settingsTab:     'Settings',
      infoTab:         'Info',
      settingsLang:    'Language',
      infoHeading:     'About the Vintra Bot',
      infoText:        'Here you can ask about our services…',
    },
    sv: {
    placeholder:    "Skriv ett meddelande…",
    initialMessage: "Hej! Jag är Vintras AI-assistent. Vad kan jag hjälpa dig med? PS: Du kan ändra språk i inställningarna (...).",
    errorMessage:   "Något gick fel…",
    sendButton:     "Skicka",
    settingsTab:    "Inställningar",
    infoTab:        "Info",
    settingsLang:   "Språk",
    infoHeading:    "Om Vintra-boten",
    infoText:       "Här kan du ställa frågor om våra tjänster…",
  },

  da: {
    placeholder:    "Skriv en besked…",
    initialMessage: "Hej! Jeg er Vintras AI-assistent. Hvad kan jeg hjælpe dig med? PS: Du kan ændre sprog i indstillingerne (...).",
    errorMessage:   "Noget gik galt…",
    sendButton:     "Send",
    settingsTab:    "Indstillinger",
    infoTab:        "Info",
    settingsLang:   "Sprog",
    infoHeading:    "Om Vintra-botten",
    infoText:       "Her kan du stille spørgsmål om vores tjenester…",
  },

  fi: {
    placeholder:    "Kirjoita viesti…",
    initialMessage: "Hei! Olen Vintran AI-avustaja. Kuinka voin auttaa sinua? PS: Voit vaihtaa kieltä asetuksista (...).",
    errorMessage:   "Jokin meni pieleen…",
    sendButton:     "Lähetä",
    settingsTab:    "Asetukset",
    infoTab:        "Tietoa",
    settingsLang:   "Kieli",
    infoHeading:    "Tietoa Vintra-botista",
    infoText:       "Täällä voit kysyä palveluistamme…",
  },

  de: {
    placeholder:    "Nachricht schreiben…",
    initialMessage: "Hallo! Ich bin Vintras KI-Assistent. Wie kann ich dir helfen? PS: Du kannst die Sprache in den Einstellungen ändern (...).",
    errorMessage:   "Etwas ist schiefgelaufen…",
    sendButton:     "Senden",
    settingsTab:    "Einstellungen",
    infoTab:        "Info",
    settingsLang:   "Sprache",
    infoHeading:    "Über den Vintra-Bot",
    infoText:       "Hier kannst du Fragen zu unseren Diensten stellen…",
  },

  fr: {
    placeholder:    "Tapez un message…",
    initialMessage:  "Bonjour ! Je suis l’assistant IA de Vintra. Comment puis-je vous aider ? PS : Vous pouvez changer la langue dans les paramètres (...).",
    errorMessage:   "Une erreur est survenue…",
    sendButton:     "Envoyer",
    settingsTab:    "Paramètres",
    infoTab:        "Info",
    settingsLang:   "Langue",
    infoHeading:    "À propos du bot Vintra",
    infoText:       "Ici, vous pouvez poser des questions sur nos services…",
  },

  es: {
    placeholder:    "Escribe un mensaje…",
    initialMessage: "¡Hola! Soy el asistente de IA de Vintra. ¿En qué puedo ayudarte? PD: Puedes cambiar el idioma en la configuración (...).",
    errorMessage:   "Algo salió mal…",
    sendButton:     "Enviar",
    settingsTab:    "Configuración",
    infoTab:        "Info",
    settingsLang:   "Idioma",
    infoHeading:    "Acerca del bot de Vintra",
    infoText:       "Aquí puedes hacer preguntas sobre nuestros servicios…",
  },

  zh: {
    placeholder:    "输入消息…",
    initialMessage:  "您好！我是 Vintra 的人工智能助手。我能帮您做些什么？附注：您可以在设置中更改语言 (...).",
    errorMessage:   "出现错误…",
    sendButton:     "发送",
    settingsTab:    "设置",
    infoTab:        "信息",
    settingsLang:   "语言",
    infoHeading:    "关于 Vintra 机器人",
    infoText:       "在这里，您可以询问我们的服务…",
  },

  ja: {
    placeholder:    "メッセージを入力…",
    initialMessage: "こんにちは！私は Vintra の AI アシスタントです。何かお手伝いできることはありますか？追伸：設定で言語を変更できます (...).",
    errorMessage:   "エラーが発生しました…",
    sendButton:     "送信",
    settingsTab:    "設定",
    infoTab:        "情報",
    settingsLang:   "言語",
    infoHeading:    "Vintra ボットについて",
    infoText:       "ここでは当社のサービスについて質問できます…",
  },

  ko: {
    placeholder:    "메시지를 입력하세요…",
    initialMessage: "안녕하세요! 저는 Vintra의 AI 어시스턴트입니다. 어떻게 도와드릴까요? PS: 설정에서 언어를 변경할 수 있습니다 (...).",
    errorMessage:   "문제가 발생했습니다…",
    sendButton:     "전송",
    settingsTab:    "설정",
    infoTab:        "정보",
    settingsLang:   "언어",
    infoHeading:    "Vintra 봇 정보",
    infoText:       "여기에서 서비스에 대해 문의할 수 있습니다…",
  }
  } as const;
  // ───────────────────

  // Hent ut type-sikkerhets-type av språkene
 type Locale = keyof typeof translations;

export default function ChatPage() {
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isBotTyping, setBotTyping] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayTab, setOverlayTab] = useState<"settings" | "info">("settings");
  const [language, setLanguage] = useState<Locale>("en");

  const t = translations[language];
  const [idleState, setIdleState] = useState<"none" | "smile" | "tired" | "sleep">("none");
  const idleTimers = useRef<NodeJS.Timeout[]>([]);
  const [atEdge, setAtEdge] = useState<"none" | "top" | "bottom">("none");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1) Generate/restore userId once
  useEffect(() => {
    let id = localStorage.getItem("chatUserId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("chatUserId", id);
    }
    setUserId(id);
  }, []);

  // 2) Idle-state scheduling
  const resetIdleTimers = () => {
    idleTimers.current.forEach(clearTimeout);
    idleTimers.current = [];
    setIdleState("none");
    idleTimers.current.push(
      setTimeout(() => setIdleState("smile"), 25_000),
      setTimeout(() => setIdleState("none"), 27_000),
      setTimeout(() => setIdleState("tired"), 40_000),
      setTimeout(() => setIdleState("sleep"), 42_000)
    );
  };
  useEffect(() => {
    resetIdleTimers();
  }, [messages.length, isBotTyping]);

  useEffect(() => {
    return () => idleTimers.current.forEach(clearTimeout);
  }, []);

  // 3) Scroll-edge detection
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      if (el.scrollTop === 0) setAtEdge("top");
      else if (el.scrollHeight - el.scrollTop === el.clientHeight) setAtEdge("bottom");
      else setAtEdge("none");
    };
    el.addEventListener("scroll", check);
    check();
    return () => el.removeEventListener("scroll", check);
  }, []);

  // 4) Auto-scroll on new
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);
// 5) Remote cursor — receiver (og lokal fallback)
useEffect(() => {
  const ring = document.getElementById("remote-cursor") as HTMLDivElement | null;
  if (!ring) return;

  // Hva vi regner som klikkbart
  const INTERACTIVE_SELECTOR =
    'a,button,[role="button"],input,select,textarea,label,[data-clickable="true"],.clickable';

  const isNumber = (v: unknown): v is number =>
    typeof v === "number" && Number.isFinite(v);

  type CursorMessage =
    | { type: "cursor-enter" }
    | { type: "cursor-leave" }
    | { type: "cursor-down" }
    | { type: "cursor-up" }
    | { type: "cursor-move"; x: number; y: number; down?: boolean };

  const isCursorMessage = (d: unknown): d is CursorMessage => {
    if (!d || typeof d !== "object") return false;
    const rec = d as Record<string, unknown>;
    const t = rec.type;
    if (t === "cursor-enter" || t === "cursor-leave" || t === "cursor-down" || t === "cursor-up")
      return true;
    if (t === "cursor-move") return isNumber(rec.x) && isNumber(rec.y);
    return false;
  };

  const setPos = (x: number, y: number) => {
    ring.style.transform = `translate(${x - ring.offsetWidth / 2}px, ${y - ring.offsetHeight / 2}px)`;
  };

  const updateHoverAt = (x: number, y: number) => {
    // element under den posisjonen
    const el = document.elementFromPoint(x, y) as Element | null;
    const clickable = !!el?.closest?.(INTERACTIVE_SELECTOR);
    ring.classList.toggle("hover", clickable);
  };

  let lastParentMsg = 0;

  const onMessage = (e: MessageEvent) => {
    const data: unknown = e.data;
    if (!isCursorMessage(data)) return;

    switch (data.type) {
      case "cursor-enter":
        ring.classList.remove("hidden");
        lastParentMsg = Date.now();
        break;
      case "cursor-leave":
        ring.classList.add("hidden");
        ring.classList.remove("active", "hover");
        lastParentMsg = Date.now();
        break;
      case "cursor-move":
        ring.classList.remove("hidden");
        setPos(data.x, data.y);
        ring.classList.toggle("active", !!data.down);
        updateHoverAt(data.x, data.y);
        lastParentMsg = Date.now();
        break;
      case "cursor-down":
        ring.classList.add("active");
        lastParentMsg = Date.now();
        break;
      case "cursor-up":
        ring.classList.remove("active");
        lastParentMsg = Date.now();
        break;
    }
  };

  window.addEventListener("message", onMessage);

  // Lokal fallback hvis ingen parent-meldinger 🙃
  const FALLBACK_MS = 150;
  const onLocalMove = (e: MouseEvent) => {
    if (Date.now() - lastParentMsg > FALLBACK_MS) {
      ring.classList.remove("hidden");
      setPos(e.clientX, e.clientY);
      updateHoverAt(e.clientX, e.clientY);
    }
  };
  const onLocalDown = () => {
    if (Date.now() - lastParentMsg > FALLBACK_MS) ring.classList.add("active");
  };
  const onLocalUp = () => {
    if (Date.now() - lastParentMsg > FALLBACK_MS) ring.classList.remove("active");
  };

  window.addEventListener("mousemove", onLocalMove, { passive: true });
  window.addEventListener("mousedown", onLocalDown);
  window.addEventListener("mouseup", onLocalUp);

  return () => {
    window.removeEventListener("message", onMessage);
    window.removeEventListener("mousemove", onLocalMove);
    window.removeEventListener("mousedown", onLocalDown);
    window.removeEventListener("mouseup", onLocalUp);
  };
}, []);


  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const handleBubble = () => {
    setOpen((v) => !v);
    setOverlayVisible(false);
    if (!open && messages.length === 0) {
      addMessage({
        text: t.initialMessage,
        sender: "bot",
        icon: "inactive",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setOverlayVisible(false);
    const txt = input.trim();
    if (!txt || !userId) return;

    addMessage({ text: txt, sender: "user", icon: "user" });
    setInput("");
    setBotTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: txt, lang: language }),
      });
      const { reply } = await res.json();
      setTimeout(() => {
        setBotTyping(false);
        addMessage({
          text: reply ?? t.errorMessage,
          sender: "bot",
          icon: "inactive",
        });
      }, 1500);
    } catch {
      setTimeout(() => {
        setBotTyping(false);
        addMessage({
          text: t.errorMessage,
          sender: "bot",
          icon: "error",
        });
      }, 1500);
    }
  };

  const lastBotIndex =
    messages
      .map((m, i) => (m.sender === "bot" ? i : -1))
      .filter((i) => i >= 0)
      .pop() ?? -1;

  const isUserTyping = input.trim().length > 0;

  return (
    <>
      <Head>
        <title>Vintra Chat</title>
      </Head>

      {/* Global style på denne siden: skjul native cursor og style ringen */}
      <style jsx global>{`
  /* Hide native cursor EVERYWHERE on this page */
  html, body, * {
    cursor: none !important;
  }

  #remote-cursor {
    position: fixed;
    z-index: 2147483647;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #fff;
    pointer-events: none;
    transform: translate(-100px, -100px);
    transition:
      transform 16ms linear,
      width 80ms ease, height 80ms ease,
      border-color 80ms ease,
      box-shadow 120ms ease,
      background-color 120ms ease,
      opacity 120ms ease,
      filter 120ms ease;
    box-shadow: 0 0 8px rgba(255,255,255,.25);
  }
  /* Red hover state */
  #remote-cursor.hover {
    border-color: #b40f3a;
    box-shadow: 0 0 14px rgba(180,15,58,.55);
    background: radial-gradient(transparent 60%, rgba(180,15,58,.12));
    width: 26px;
    height: 26px;
  }
  /* Blue active (mouse down) state */
  #remote-cursor.active {
    border-color: #3bb4ff;
    box-shadow: 0 0 16px rgba(59,180,255,.55);
    background: radial-gradient(transparent 60%, rgba(59,180,255,.10));
    width: 22px;
    height: 22px;
  }
  #remote-cursor.hidden {
    opacity: 0;
  }
`}</style>

      {/* Selve cursor-elementet */}
      <div id="remote-cursor" className="hidden" aria-hidden="true" />

      <div className={styles.container}>
        {/* Toggle bubble */}
        <div
          className={`${styles.bubble} ${isBotTyping ? styles.bubbleTyping : ""}`}
          onClick={handleBubble}
        >
          💬
        </div>

        {/* Chat window */}
        <div className={`${styles.chatWindow} ${open ? styles.open : ""}`}>
          <header className={styles.header}>
            <h3 className={styles.headerTitle}>Vintra AI</h3>
          </header>

          {/* --- MELDINGSOMRÅDE + OVERLAY --- */}
          <div className={styles.messagesContainer}>
            {overlayVisible && (
              <div className={styles.overlay}>
                <div className={styles.overlayHeader}>
                  <button
                    className={styles.overlayClose}
                    onClick={() => setOverlayVisible(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.overlayTabs}>
                  <button
                    className={overlayTab === "settings" ? styles.activeTab : ""}
                    onClick={() => setOverlayTab("settings")}
                  >
                    {t.settingsTab}
                  </button>
                  <button
                    className={overlayTab === "info" ? styles.activeTab : ""}
                    onClick={() => setOverlayTab("info")}
                  >
                    {t.infoTab}
                  </button>
                </div>
                <div className={styles.overlayContent}>
                  {overlayTab === "settings" ? (
                    <div className={styles.settingRow}>
                      <label>{t.settingsLang}</label>
                      <select
                        className={styles.LangOption}
                        value={language}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setLanguage(e.target.value as Locale)
                        }
                      >
                        <option value="no">Norsk</option>
                        <option value="sv">Svenska</option>
                        <option value="da">Dansk</option>
                        <option value="fi">Suomi</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h5>{t.infoHeading}</h5>
                      <p>{t.infoText}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* meldingsliste */}
            <div ref={scrollRef} className={`${styles.messages} ${styles[atEdge]}`}>
              {messages.map((m, i) => {
                const isLastBot = i === lastBotIndex;
                const showAvatar = m.sender === "bot" && isLastBot && !isBotTyping;

                const avatarIcon = isUserTyping
                  ? ICONS.user
                  : idleState !== "none" && messages.length > 0 && isLastBot
                  ? ICONS[idleState as IconType]
                  : ICONS[m.icon];

                return (
                  <div
                    key={i}
                    className={`${styles.messageRow} ${
                      m.sender === "user" ? styles.messageRowUser : styles.messageRowBot
                    }`}
                  >
                    {showAvatar && <div className={styles.avatar}>{avatarIcon}</div>}
                    <div
                      className={`${styles.messageBubble} ${
                        m.sender === "user" ? styles.userBubble : styles.botBubble
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {isBotTyping && (
                <div className={`${styles.messageRow} ${styles.messageRowBot}`}>
                  <div className={styles.avatar}>{ICONS.writing}</div>
                  <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                    <div className={styles.typing}>
                      <span className={styles.dot} />
                      <span className={`${styles.dot} ${styles.delay1}`} />
                      <span className={`${styles.dot} ${styles.delay2}`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* footer */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className={styles.input}
              autoComplete="off"
            />
            <button type="submit" className={styles.button}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setOverlayVisible((v) => !v);
                setOverlayTab("settings");
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}