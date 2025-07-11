// pages/chat.tsx
"use client";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState, ChangeEvent } from "react";
import { ICONS, IconType } from "../../../components/ChatIcons";


import styles from "../../../styles/Chat.module.css";

interface Message {
  text: string;
  sender: "user" | "bot";
  icon: IconType;   // used only for final bot reply when not idle
}

 // ───────────────────
  // INLINE TRANSLATIONS
  const translations = {
    no: {
      systemPrompt: `Du er Vintra sin AI-assistent for VintraStudio og spillet VOTE.
                      VintraStudio er en indie-game bedrift med tre ansatte som elsker programmering (mer om oss på “About Us”).
                      Spillet vårt, VOTE, er under utvikling med Unreal Engine 5.6 og Blender til modellering, og vi planlegger lansering om ca. 1,5 år (du kan følge nedtellingen på spillsiden).
                      VOTE er et story-basert, åpent verden-spill med fokus på nordisk natur og kultur. Spilleren møter mytologiske figurer (vennlige, skumle og fientlige) mens hen prøver å finne faren sin i en magisk verden.
                      Mer info og konseptkunst finner du under spillsiden “VOTE”. Prisen er ikke endelig satt, men forventes å bli mellom 200–300 kr.
                      Svar alltid vennlig, tydelig og kortfattet. Hvis du ikke vet svaret, be om mer info eller vis til vår FAQ: https://vintra.no/faq`,
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
      systemPrompt:    `You are Vintra’s AI assistant for VintraStudio and the game VOTE.
                        VintraStudio is an indie game studio with three employees who love programming (read more on “About Us”).
                        Our game, VOTE, is under development using Unreal Engine 5.6 and Blender for modeling, and is slated for release in about 1.5 years (see the countdown on the game page).
                        VOTE is a story-based open-world game focused on Nordic nature and culture. Players encounter mythological beings (friendly, scary, and hostile) while searching for their father in a magical world.
                        More info and concept art can be found on the “VOTE” page. The price isn’t fixed yet but is expected to be between $19.80–$29.71 or £14.50-£21.75.
                        Always respond in a friendly, clear, and concise manner. If you don’t know the answer, ask for more info or point the user to our FAQ: https://vintra.no/faq`,
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
    systemPrompt:  `Du är Vintras AI-assistent för VintraStudio och spelet VOTE.
                    VintraStudio är ett indie-spelstudio med tre anställda som älskar programmering (läs mer på “About Us”).
                    Vårt spel VOTE är under utveckling med Unreal Engine 5.6 och Blender för modellering, och planeras lanseras om cirka 1,5 år (se nedräkningen på spelsidan).
                    VOTE är ett story-baserat open-world-spel med fokus på nordisk natur och kultur. Spelare möter mytologiska väsen (vänliga, läskiga och fientliga) när de söker efter sin far i en magisk värld.
                    Mer info och konceptkonst finns på sidan “VOTE”. Priset är inte fastställt än, men förväntas bli mellan 189.28–283.94 SEK.
                    Svara alltid vänligt, tydligt och koncist. Om du inte vet svaret, be om mer information eller hänvisa användaren till vår FAQ: https://vintra.no/faq`,
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
    systemPrompt:   `Du er Vintras AI-assistent for VintraStudio og spillet VOTE.
                    VintraStudio er et indie-spilstudie med tre medarbejdere, der elsker programmering (læs mere på “About Us”).
                    Vores spil VOTE er under udvikling med Unreal Engine 5.6 og Blender til modellering, og udkommer om ca. 1,5 år (se nedtællingen på spilsiden).
                    VOTE er et story-baseret open-world-spil med fokus på nordisk natur og kultur. Spillere møder mytologiske væsener (venlige, skræmmende og fjendtlige), mens de leder efter deres far i en magisk verden.
                    Mere info og konceptkunst findes på “VOTE”-siden. Prisen er ikke fastsat endnu, men forventes at blive mellem 125.51–188.27 DKK.
                    Svar altid venligt, klart og kortfattet. Hvis du ikke kender svaret, bed om mere info eller henvis brugeren til vores FAQ: https://vintra.no/faq`,
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
    systemPrompt:   `Olet VintraStudion ja VOTE-pelin tekoälyavustaja.
                    VintraStudio on indie-pelistudio, jossa työskentelee kolme ohjelmoinnista innostunutta työntekijää (lue lisää “About Us” -sivulta).
                    Peli VOTE on kehitysvaiheessa Unreal Engine 5.6:lla ja Blenderillä mallinnukseen, ja sen julkaisu on suunniteltu noin 1,5 vuoden päähän (katso laskuri pelisivulta).
                    VOTE on tarinavetoinen avoimen maailman peli, joka keskittyy pohjoismaiseen luontoon ja kulttuuriin. Pelaajat kohtaavat mytologisia olentoja (ystävällisiä, pelottavia ja vihamielisiä) etsiessään isäänsä maagisessa maailmassa.
                    Lisätietoa ja konseptitaidetta löytyy “VOTE”-sivulta. Hinta ei ole vielä vahvistettu, mutta arvioidaan olevan €16.79-€25.19.
                    Vastaa aina ystävällisesti, selkeästi ja ytimekkäästi. Jos et tiedä vastausta, pyydä lisätietoja tai ohjaa käyttäjä FAQ:hen: https://vintra.no/faq`,
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
    systemPrompt:   `Du bist Vintras KI-Assistent für VintraStudio und das Spiel VOTE.
                    VintraStudio ist ein Indie-Game-Studio mit drei Mitarbeitern, die Programmierung lieben (mehr unter “About Us”).
                    Unser Spiel VOTE befindet sich in Entwicklung mit Unreal Engine 5.6 und Blender für die Modellierung und soll in etwa 1,5 Jahren erscheinen (siehe Countdown auf der Spieleseite).
                    VOTE ist ein storybasiertes Open-World-Spiel mit Fokus auf nordische Natur und Kultur. Spieler begegnen mythologischen Wesen (freundlich, unheimlich und feindlich), während sie in einer magischen Welt nach ihrem Vater suchen.
                    Mehr Infos und Konzeptkunst finden sich auf der “VOTE”-Seite. Der Preis ist noch nicht festgelegt, wird aber voraussichtlich zwischen €16.79-€25.19 liegen.
                    Antworte stets freundlich, klar und prägnant. Wenn du die Antwort nicht kennst, bitte um mehr Infos oder verweise den Nutzer auf unsere FAQ: https://vintra.no/faq`,
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
    systemPrompt:   `Vous êtes l’assistant IA de Vintra pour VintraStudio et le jeu VOTE.
                    VintraStudio est un studio de jeux indie composé de trois employés passionnés de programmation (en savoir plus sur “About Us”).
                    Notre jeu VOTE est en cours de développement avec Unreal Engine 5.6 et Blender pour la modélisation, et devrait sortir dans environ 1,5 an (voir le compte à rebours sur la page du jeu).
                    VOTE est un jeu en monde ouvert basé sur une histoire, axé sur la nature et la culture nordiques. Les joueurs rencontrent des êtres mythologiques (amicaux, effrayants et hostiles) en cherchant leur père dans un monde magique.
                    Plus d’infos et des concept arts sont disponibles sur la page “VOTE”. Le prix n’est pas encore fixé, mais devrait se situer entre €16.79 et €25.19.
                    Répondez toujours de manière amicale, claire et concise. Si vous ne connaissez pas la réponse, demandez plus d’informations ou dirigez l’utilisateur vers notre FAQ : https://vintra.no/faq`,
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
    systemPrompt:   `Eres el asistente IA de Vintra para VintraStudio y el juego VOTE.
                    VintraStudio es un estudio de juegos indie con tres empleados que aman la programación (más información en “About Us”).
                    Nuestro juego VOTE está en desarrollo con Unreal Engine 5.6 y Blender para modelado, y está previsto para lanzamiento en aproximadamente 1,5 años (consulta la cuenta atrás en la página del juego).
                    VOTE es un juego de mundo abierto basado en historia, centrado en la naturaleza y cultura nórdicas. Los jugadores se encuentran con seres mitológicos (amigables, aterradores y hostiles) mientras buscan a su padre en un mundo mágico.
                    Más información y arte conceptual en la página “VOTE”. El precio aún no está definido, pero se espera que esté entre €16.79 y €25.19.
                    Responde siempre de manera amigable, clara y concisa. Si no conoces la respuesta, pide más información o dirige al usuario a nuestras FAQ : https://vintra.no/faq`,
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
    systemPrompt:    `您是 Vintra 的 AI 助手，服务于 VintraStudio 和游戏 VOTE。
                      VintraStudio 是一家由三名热爱编程的员工组成的独立游戏工作室（更多信息请见“About Us”）。
                      我们的游戏 VOTE 正在使用 Unreal Engine 5.6 开发，并使用 Blender 进行建模，预计将在大约 1.5 年后发布（请参阅游戏页面的倒计时）。
                      VOTE 是一款以讲故事为基础的开放世界游戏，专注于北欧自然与文化。玩家在魔法世界中寻找父亲时，会遇到友好、可怕和敌对的神话生物。
                      更多信息和概念图可在投票页面上查看。游戏定价尚未确定，预计在 141.41 至 212.15 日元之间。
                      始终以友好、清晰和简洁的方式回复。如果您不知道答案，请请求更多信息或将用户引导至我们的常见问题页面： https://vintra.no/faq`,
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
    systemPrompt:   `あなたは VintraStudio とゲーム VOTE のための Vintra の AI アシスタントです。
                    VintraStudio はプログラミングを愛する 3 人の社員からなるインディーゲームスタジオです（「About Us」で詳細を確認できます）。
                    私たちのゲーム VOTE は Unreal Engine 5.6 と Blender で開発中で、約 1.5 年後のリリースを予定しています（ゲームページのカウントダウンをご覧ください）。
                    VOTE は北欧の自然と文化に焦点を当てたストーリーベースのオープンワールドゲームです。プレイヤーは魔法の世界で父親を探す過程で、友好的、恐ろしい、敵対的な神話上の存在と出会います。
                    詳しい情報やコンセプトアートは「VOTE」ページでご覧いただけます。価格は未定ですが、¥2,856～¥4,284 の間になる見込みです。
                    常に友好的で明確かつ簡潔に回答してください。答えがわからない場合は、追加情報を求めるか、FAQ（https://vintra.no/faq）を案内してください。`,
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
    systemPrompt:   `당신은 VintraStudio와 게임 VOTE를 위한 Vintra의 AI 어시스턴트입니다.
                    VintraStudio는 프로그래밍을 좋아하는 직원 세 명으로 구성된 인디 게임 스튜디오입니다(자세한 내용은 “About Us” 참조).
                    우리 게임 VOTE는 Unreal Engine 5.6과 Blender를 사용해 개발 중이며 약 1.5 년 후 출시될 예정입니다(게임 페이지의 카운트다운 참조).
                    VOTE는 북유럽의 자연과 문화에 중점을 둔 스토리 기반 오픈 월드 게임입니다. 플레이어는 마법 세계에서 아버지를 찾는 과정에서 친절한, 무서운, 적대적인 신화 속 존재들과 마주합니다.
                    더 많은 정보와 컨셉 아트는 “VOTE” 페이지에서 확인할 수 있습니다. 가격은 아직 확정되지 않았지만 ₩26,918~₩40,385 사이가 될 것으로 예상됩니다.
                    항상 친절하고 명확하며 간결하게 응답하세요. 답을 모를 경우 추가 정보를 요청하거나 FAQ(https://vintra.no/faq)로 안내하세요.`,
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
  const [userId, setUserId]         = useState("");
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [open, setOpen]             = useState(false);
  const [isBotTyping, setBotTyping] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayTab, setOverlayTab] = useState<"settings"|"info">("settings");
  const [language, setLanguage] = useState<Locale>("en");

  // grab the active translation bundle
  const t = translations[language];

  const [idleState, setIdleState] = useState<"none"|"smile"|"tired"|"sleep">("none");
  const idleTimers = useRef<NodeJS.Timeout[]>([]);

  const [atEdge, setAtEdge] = useState<"none"|"top"|"bottom">("none");
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

  // 2) Idle‐state scheduling
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

  // 3) Scroll‐edge detection
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

  // 4) Auto‐scroll on new
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  const addMessage = (msg: Message) =>
    setMessages((prev) => [...prev, msg]);

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
     // lukk overlay ved send
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

  const lastBotIndex = messages
    .map((m, i) => (m.sender === "bot" ? i : -1))
    .filter((i) => i >= 0)
    .pop() ?? -1;

  const isUserTyping = input.trim().length > 0;

  return (
  <>
    <Head>
      <title>Vintra Chat</title>
    </Head>
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
          {/* overlay som dekker bare meldings-lista */}
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

          {/* selve meldingslisten */}
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
                    m.sender === "user"
                      ? styles.messageRowUser
                      : styles.messageRowBot
                  }`}
                >
                  {showAvatar && (
                    <div className={styles.avatar}>{avatarIcon}</div>
                  )}
                  <div
                    className={`${styles.messageBubble} ${
                      m.sender === "user"
                        ? styles.userBubble
                        : styles.botBubble
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
        {/* --- SLUTT MELDINGSOMRÅDE --- */}

        {/* footer med input + knapp */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.placeholder}
              className={styles.input}
              autoComplete="off"
          />
          <button type="submit" className={styles.button}>
            {/* papirfly-ikon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setOverlayVisible(v => !v);
              setOverlayTab("settings");
            }}
          >
            {/* …-ikon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </>
);
}