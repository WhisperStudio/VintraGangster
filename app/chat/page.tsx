import { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { text: string; sender: "user" | "bot" };

const ChatPage: NextPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [open, setOpen]       = useState(false);
  const [typing, setTyping]   = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generer/finn userId i localStorage på klient
  useEffect(() => {
    if (typeof window === "undefined") return;
    let id = localStorage.getItem("chatUserId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("chatUserId", id);
    }
    setUserId(id);
  }, []);

  // Scroll til bunn etter hver melding
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addMessage = (text: string, sender: "user"|"bot") =>
    setMessages((prev) => [...prev, { text, sender }]);

  const handleBubble = () => {
    setOpen((v) => !v);
    if (!open && messages.length === 0)
      addMessage("Hei! Jeg er Vintra sin AI-assistent. Hva kan jeg hjelpe med?", "bot");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;
    addMessage(input, "user");
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input }),
      });
      const json = await res.json();
      setTyping(false);
      if ("reply" in json) addMessage(json.reply, "bot");
      else addMessage("Ingen svar.", "bot");
    } catch {
      setTyping(false);
      addMessage("Noe gikk galt…", "bot");
    }
  };

  return (
    <>
      <Head>
        <title>Vintra Chat</title>
      </Head>

      <div className="fixed bottom-4 right-4 z-50">
        {/* BOBLE */}
        <div onClick={handleBubble}
             className="bg-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer animate-pulse">
          💬
        </div>

        {/* SELVE CHAT */}
        <div className={`mt-2 w-80 h-[520px] bg-[#0a0a0a] 
                         border border-gray-800 rounded-xl shadow-xl
                         flex flex-col ${open ? "flex" : "hidden"}`}>
          <div className="p-4 bg-black/30 border-b border-gray-700">
            <h3 className="text-white font-semibold">Vintra AI</h3>
          </div>
          <div ref={scrollRef}
               className="flex-1 p-4 overflow-y-auto space-y-3 text-sm text-white">
            {messages.map((m,i) => (
              <div key={i}
                   className={`flex ${m.sender==="user"?"justify-end":"justify-start"}`}>
                <div className={`p-2 rounded-lg max-w-xs
                                 ${m.sender==="user"?"bg-white text-black":"bg-gray-800"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 pl-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-[pulse_1.4s_infinite]"/>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-[pulse_1.4s_infinite_0.2s]"/>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-[pulse_1.4s_infinite_0.4s]"/>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}
                className="p-3 bg-black/20 border-t border-gray-700 flex gap-2">
            <input type="text" value={input}
                   onChange={e=>setInput(e.target.value)}
                   placeholder="Skriv melding…"
                   className="flex-1 bg-gray-900 px-3 py-2 rounded-lg focus:outline-none"/>
            <button type="submit"
                    className="bg-white text-black px-3 rounded-lg">Send</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
