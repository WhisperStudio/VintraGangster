// pages/chat.tsx
import { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { text: string; sender: "user" | "bot" };

const ChatPage: NextPage = () => {
 // pages/chat.tsx
const [userId] = useState<string>(() => {
  // On server, just return an empty string (won’t actually be used)
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("chatUserId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chatUserId", id);
  }
  return id;
});

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [open, setOpen]         = useState(false);
  const [typing, setTyping]     = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleBubble = () => {
    setOpen((v) => !v);
    if (!open && messages.length === 0) {
      addMessage("Hei! Jeg er Vintra sin AI-assistent. Hva kan jeg hjelpe deg med?", "bot");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || !userId) return;
    addMessage(msg, "user");
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: msg }),
      });
      const json = await res.json();
      setTyping(false);
      if ("reply" in json) {
        addMessage(json.reply, "bot");
      } else {
        addMessage("Beklager, ingen svar mottatt.", "bot");
      }
    } catch (error) {
      setTyping(false);
      addMessage("Noe gikk galt. Prøv igjen senere.", "bot");
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Vintra Studios – Chat</title>
        <script src="https://cdn.tailwindcss.com" />
      </Head>

      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Window */}
        <div
          className={`absolute bottom-16 right-0 w-80 h-[520px] bg-[#0a0a0a]
            border border-[#27272a] rounded-lg shadow-2xl flex flex-col
            ${open ? "flex" : "hidden"}`}
        >
          <div className="p-4 bg-black/30 border-b border-gray-800 flex items-center">
            <h3 className="font-semibold text-white">Vintra Support AI</h3>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto text-white text-sm"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-xl ${
                    m.sender === "user"
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 pl-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-blink delay-0" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-blink delay-200" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-blink delay-400" />
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-black/20 border-t border-gray-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv en melding..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-500 text-white focus:outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-white text-black p-2 rounded-lg hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Chat Bubble */}
        <div
          onClick={handleBubble}
          className="bg-white text-black w-15 h-15 rounded-full flex items-center justify-center cursor-pointer animate-pulse relative"
        >
          <div
            className={`absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg viewBox="0 0 200 100" className="w-44 h-16">
              <defs>
                <path id="arcPath" d="M 40 50 A 60 60 0 0 1 160 50" fill="none" />
              </defs>
              <text>
                <textPath
                  href="#arcPath"
                  startOffset="50%"
                  textAnchor="middle"
                  className="fill-white font-bold text-lg drop-shadow"
                >
                  Chat with us! 👋
                </textPath>
              </text>
            </svg>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A9.99 9.99 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 1.4s infinite ease-in-out both;
        }
        .delay-0 {
          animation-delay: 0ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </>
  );
};

export default ChatPage;
