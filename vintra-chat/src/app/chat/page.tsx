// pages/chat.tsx
"use client";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";
import * as React from 'react';
import styles from "../../../styles/Chat.module.css";

type IconType = "inactive" | "writing" | "error" | "user";
interface Message {
  text: string;
  sender: "user" | "bot";
  icon: IconType;
}

// Lim inn dine SVG-ikoner her:
const SVG_ICONS: Record<IconType, React.ReactNode> = {
  // Bot inaktiv
  inactive: (
    <svg fill="#ffffff" viewBox="0 0 103.696 103.696" stroke="#ffffff">
      <g>
        <path d="M40.842,40.637H27.471c-1.738,0-3.148-1.409-3.148-3.147c0-1.738,1.41-3.147,3.148-3.147h13.371c1.738,0,3.148,1.409,3.148,3.147C43.99,39.228,42.58,40.637,40.842,40.637z M79.371,37.491c0,1.738-1.407,3.147-3.146,3.147H62.853c-1.736,0-3.146-1.409-3.146-3.147s1.41-3.147,3.146-3.147h13.373C77.964,34.344,79.371,35.753,79.371,37.491z M74.836,62.887c-3.844,8.887-12.844,14.629-22.928,14.629c-10.301,0-19.355-5.771-23.064-14.703c-0.637-1.529,0.088-3.285,1.619-3.92c0.377-0.156,0.766-0.23,1.15-0.23c1.176,0,2.291,0.695,2.771,1.85c2.775,6.686,9.654,11.004,17.523,11.004c7.689,0,14.527-4.321,17.42-11.01c0.658-1.521,2.424-2.223,3.945-1.564C74.793,59.6,75.493,61.366,74.836,62.887z M85.466,103.696H18.231c-10.053,0-18.23-8.179-18.23-18.229V18.23C0.001,8.178,8.179,0,18.231,0h67.235c10.053,0,18.229,8.178,18.229,18.23v67.235C103.696,95.518,95.519,103.696,85.466,103.696z M18.231,8.579c-5.322,0-9.652,4.33-9.652,9.651v67.235c0,5.321,4.33,9.651,9.652,9.651h67.235c5.321,0,9.651-4.33,9.651-9.651V18.23c0-5.321-4.33-9.651-9.651-9.651H18.231z"/>
      </g>
    </svg>
  ),

  // Bot skriver
  writing: (
    <svg fill="#ffffff" viewBox="0 0 103.696 103.695" stroke="#ffffff">
      <g>
        <path d="M75.078,40.488c0,1.381-1.119,2.5-2.5,2.5s-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.698-3.701c-2.044,0-3.703,1.66-3.703,3.701c0,1.381-1.119,2.5-2.5,2.5c-1.382,0-2.5-1.119-2.5-2.5c0-4.797,3.903-8.701,8.703-8.701C71.176,31.786,75.078,35.691,75.078,40.488z M29.953,40.461c0-4.798,3.904-8.7,8.703-8.7c4.797,0,8.701,3.902,8.701,8.7c0,1.381-1.119,2.5-2.5,2.5c-1.381,0-2.5-1.119-2.5-2.5c0-2.04-1.66-3.7-3.701-3.7c-2.043,0-3.703,1.66-3.703,3.7c0,1.381-1.119,2.5-2.5,2.5S29.953,41.842,29.953,40.461z M66.376,51.847c-2.252,0-4.079-1.827-4.079-4.081c0-2.253,1.827-4.079,4.079-4.079s4.078,1.826,4.078,4.079C70.455,50.02,68.628,51.847,66.376,51.847z M42.732,47.766c0,2.254-1.826,4.081-4.078,4.081s-4.078-1.827-4.078-4.081c0-2.253,1.826-4.079,4.078-4.079S42.732,45.513,42.732,47.766z M74.457,69.848c0,1.92-1.56,3.479-3.479,3.479H32.718c-1.92,0-3.479-1.559-3.479-3.479c0-1.922,1.559-3.479,3.479-3.479h38.259C72.899,66.368,74.457,67.926,74.457,69.848z M21.555,47.774c0,0,0.541,3.958-3.027,4.445c0,0-3.654,0.531-4.156-3.146c0,0-0.229-1.674,0.732-3.64c0,0,0.857-1.729,0.918-4.51C16.021,40.924,21.09,44.37,21.555,47.774z M73.901,21.309c1.219,1.818,1.219,3.508,1.219,3.508c0,3.711-3.693,3.678-3.693,3.678c-3.6,0-3.6-3.994-3.6-3.994c0-3.436,4.555-7.535,4.555-7.535C72.819,19.712,73.901,21.309,73.901,21.309z M89.848,56.793c0,3.711-3.693,3.678-3.693,3.678c-3.6,0-3.6-3.994-3.6-3.994c0-3.436,4.555-7.535,4.555-7.535c0.438,2.747,1.52,4.344,1.52,4.344C89.848,55.104,89.848,56.793,89.848,56.793z M85.465,103.695H18.23C8.178,103.695,0,95.518,0,85.465V18.23C0,8.177,8.178,0,18.23,0h67.235c10.053,0,18.23,8.178,18.23,18.23v67.235C103.696,95.518,95.518,103.695,85.467,103.695z M18.23,8.577c-5.321,0-9.651,4.33-9.651,9.652v67.234c0,5.322,4.33,9.652,9.651,9.652h67.235c5.321,0,9.651-4.33,9.651-9.652V18.23c0-5.322-4.33-9.652-9.651-9.652L18.23,8.577L18.23,8.577z"/>
      </g>
    </svg>
  ),

  // Feil
  error: (
    <svg fill="#ffffff" viewBox="0 0 103.696 103.696" stroke="#ffffff">
      <g>
        <path d="M31.789,39.249l1.759-1.759l-1.76-1.761c-1.233-1.233-1.296-3.229-0.143-4.544c0.025-0.035,0.078-0.097,0.137-0.157c1.277-1.278,3.46-1.27,4.718-0.011l1.76,1.759l1.76-1.76c1.198-1.199,3.267-1.262,4.544-0.145c0.041,0.03,0.106,0.086,0.167,0.146c0.629,0.629,0.976,1.465,0.977,2.354c0,0.89-0.346,1.727-0.976,2.356l-1.76,1.76l1.758,1.759c0.63,0.629,0.977,1.466,0.977,2.355c0,0.89-0.346,1.727-0.976,2.357c-1.258,1.26-3.452,1.261-4.712,0L38.261,42.2l-1.758,1.758c-0.631,0.63-1.467,0.977-2.356,0.977c-0.89,0-1.727-0.347-2.356-0.977C30.491,42.662,30.491,40.549,31.789,39.249z M59.906,39.234l1.759-1.759l-1.76-1.761c-1.232-1.233-1.297-3.229-0.143-4.544c0.024-0.035,0.078-0.097,0.137-0.157c1.277-1.278,3.459-1.27,4.718-0.011l1.76,1.759l1.761-1.76c1.197-1.199,3.267-1.262,4.543-0.145c0.041,0.03,0.106,0.086,0.168,0.146c0.629,0.629,0.976,1.465,0.977,2.354c0,0.89-0.346,1.727-0.977,2.356l-1.76,1.76l1.758,1.759c0.631,0.629,0.978,1.466,0.978,2.355c0,0.89-0.347,1.727-0.976,2.357c-1.258,1.26-3.453,1.261-4.713,0l-1.758-1.758l-1.758,1.758c-0.631,0.63-1.467,0.978-2.355,0.978c-0.891,0-1.728-0.347-2.356-0.978C58.606,42.648,58.606,40.534,59.906,39.234z M28.997,72.504v-4.105c0-0.551,0.448-1,1-1c1.268,0,3.809-0.975,4.904-2.504c0.188-0.262,0.491-0.416,0.813-0.416c0,0,0,0,0.001,0c0.323,0,0.625,0.156,0.813,0.418c1.119,1.568,2.949,2.504,4.895,2.504c1.949,0,3.779-0.936,4.896-2.502c0.188-0.264,0.49-0.42,0.813-0.42c0,0,0,0,0.001,0c0.322,0,0.625,0.156,0.813,0.418c1.124,1.568,2.957,2.504,4.902,2.504c1.947,0,3.778-0.936,4.899-2.504c0.375-0.524,1.251-0.524,1.627,0c1.121,1.568,2.952,2.504,4.897,2.504c1.949,0,3.779-0.936,4.9-2.504c0.188-0.262,0.49-0.418,0.813-0.418l0,0c0.321,0,0.625,0.156,0.813,0.418c1.094,1.529,3.633,2.504,4.899,2.504c0.552,0,1,0.447,1,1v4.104c0,0.553-0.448,1-1,1c-1.666,0-4.097-0.933-5.688-2.4c-1.492,1.521-3.561,2.4-5.738,2.4c-2.164,0-4.223-0.871-5.713-2.375c-1.489,1.504-3.547,2.375-5.713,2.375c-2.163,0-4.222-0.871-5.713-2.375c-1.488,1.504-3.546,2.375-5.712,2.375c-2.176,0-4.244-0.88-5.735-2.4c-1.592,1.468-4.024,2.4-5.691,2.4C29.445,73.504,28.997,73.057,28.997,72.504z"/>
      </g>
    </svg>
  ),

  // Bruker
  user: (
    <svg fill="#ffffff" viewBox="0 0 103.695 103.695" stroke="#ffffff">
      <g>
        <path d="M37.26,42.99c3.586,0,6.5-2.913,6.5-6.5c0-3.588-2.914-6.5-6.5-6.5c-3.588,0-6.5,2.912-6.5,6.5C30.76,40.076,33.672,42.99,37.26,42.99z M37.26,31.99c2.48,0,4.5,2.019,4.5,4.5s-2.02,4.5-4.5,4.5c-2.482,0-4.5-2.019-4.5-4.5S34.777,31.99,37.26,31.99z M35.26,36.49c0-1.104,0.896-2,2-2s2,0.896,2,2s-0.896,2-2,2S35.26,37.593,35.26,36.49z M65.098,42.99c3.586,0,6.5-2.913,6.5-6.5c0-3.588-2.914-6.5-6.5-6.5c-3.588,0-6.5,2.912-6.5,6.5C58.598,40.076,61.51,42.99,65.098,42.99z M65.098,31.99c2.48,0,4.5,2.019,4.5,4.5s-2.02,4.5-4.5,4.5c-2.481,0-4.5-2.019-4.5-4.5S62.616,31.99,65.098,31.99z M63.098,36.49c0-1.104,0.896-2,2-2c1.104,0,2,0.896,2,2s-0.896,2-2,2C63.994,38.49,63.098,37.593,63.098,36.49z M73.537,76.368c-22.713,20.021-43.377,0-43.377,0c0-11.55,9.711-20.913,21.688-20.913S73.537,64.818,73.537,76.368z"/>
      </g>
    </svg>
  ),
};


export default function ChatPage() {
  const [userId, setUserId]         = useState("");
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [open, setOpen]             = useState(false);
  const [isBotTyping, setBotTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hent/sett bruker‐ID
  useEffect(() => {
    let id = localStorage.getItem("chatUserId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("chatUserId", id);
    }
    setUserId(id);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isBotTyping]);

  const addMessage = (msg: Message) =>
    setMessages(prev => [...prev, msg]);

  const handleBubble = () => {
    setOpen(v => !v);
    if (!open && messages.length === 0) {
      addMessage({
        text: "Hei! Jeg er Vintra sin AI-assistent. Hva kan jeg hjelpe med?",
        sender: "bot",
        icon: "inactive",
      });
    }
  };

  // Sender bruker‐melding og starter bot‐delay
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const txt = input.trim();
    if (!txt || !userId) return;

    // Legg til bruker‐melding
    addMessage({ text: txt, sender: "user", icon: "user" });
    setInput("");

    // Start “bot skriver” ❐
    setBotTyping(true);

    // Hent svar
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: txt }),
      });
      const { reply } = await res.json();

      // Delay 2s før visning
      setTimeout(() => {
        setBotTyping(false);
        if (reply) addMessage({ text: reply, sender: "bot", icon: "inactive" });
        else       addMessage({ text: "Ingen svar fra boten.", sender: "bot", icon: "error" });
      }, 2000);

    } catch {
      setTimeout(() => {
        setBotTyping(false);
        addMessage({ text: "Noe gikk galt…", sender: "bot", icon: "error" });
      }, 2000);
    }
  };

  // Indeks for siste bot‐melding
  const lastBotIndex = messages
    .map((m,i) => m.sender==="bot"? i : -1)
    .filter(i=> i>=0)
    .pop() ?? -1;

  return (
    <>
      <Head><title>Vintra Chat</title></Head>

      <div className={styles.container}>
        {/* Toggle‐knapp */}
        <div onClick={handleBubble}
             className={`${styles.bubble} ${isBotTyping?styles.bubbleTyping:""}`}>
          💬
        </div>

        {/* Chat‐vindu */}
        <div className={`${styles.chatWindow} ${open?styles.open:""}`}>
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>Vintra AI</h3>
          </div>
          <div ref={scrollRef} className={styles.messages}>
            {messages.map((m,i) => (
              <div key={i}
                   className={`${styles.messageRow} ${
                     m.sender==="user"
                       ? styles.messageRowUser
                       : styles.messageRowBot
                   }`}>
                {/* SVG‐avatar kun over siste BOT‐melding */}
                {i===lastBotIndex && (
                  <div className={styles.avatar}>
                    {SVG_ICONS[m.icon]}
                  </div>
                )}
                <div className={`${styles.messageBubble} ${
                     m.sender==="user"
                       ? styles.userBubble
                       : styles.botBubble
                   }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing‐rad når bot skriver */}
            {isBotTyping && (
              <div className={`${styles.messageRow} ${styles.messageRowBot}`}>
                <div className={styles.avatar}>
                  {SVG_ICONS.writing}
                </div>
                <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                  <div className={styles.typing}>
                    <span className={styles.dot}/>
                    <span className={`${styles.dot} ${styles.delay1}`}/>
                    <span className={`${styles.dot} ${styles.delay2}`}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder="Skriv melding…"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              <svg xmlns="http://www.w3.org/2000/svg"
                   width="20" height="20"
                   viewBox="0 0 24 24"
                   fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}