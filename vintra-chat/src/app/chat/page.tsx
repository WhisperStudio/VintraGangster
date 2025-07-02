// pages/chat.tsx
"use client";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";
import * as React from "react";
import styles from "../../../styles/Chat.module.css";

type IconType =
  | "inactive"
  | "writing"
  | "error"
  | "user"
  | "smile"
  | "tired"
  | "sleep";

interface Message {
  text: string;
  sender: "user" | "bot";
  icon: IconType;   // used only for final bot reply when not idle
}

const SVG_ICONS: Record<IconType, React.ReactNode> = {
  inactive: <>{ <svg viewBox="0 0 100 100">
  
    <rect x="5" y="5" width="90" height="90"
          rx="12" ry="12"
          fill="none"
          stroke="#ffffff"
          stroke-width="8" />

   
    <circle className={styles["eye"]}      cx="30" cy="40" r="10" />

   
    <circle className={styles["eye-circle"]} cx="30" cy="40" r="4" />
    <line   className={styles["eye-line"]}   x1="20" y1="40" x2="40" y2="40" />

   
    <circle className={styles["eye"]}      cx="70" cy="40" r="10" />
    
    <circle className={styles["eye-circle"]} cx="70" cy="40" r="4" />
    <line   className={styles["eye-line"]}   x1="60" y1="40" x2="80" y2="40" />

    
    <path fill="none"
          stroke="#ffffff"
          stroke-width="5"
          stroke-linecap="round"
          d="M30,70 Q50,90 70,70" />
  </svg>}</>,
  writing: (
  <div className={styles["face-container"]}>
    <svg
      fill="#ffffff"
      viewBox="0 0 103.696 103.695"
      stroke="#ffffff"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1) Mouth path */}
      <path
        className={styles.mouth}
        d="
          M0,78
          Q5,68 10,76
          T20,78
          T30,78
          T40,78
          T50,78
          T60,78
          T70,78
          T80,78
          T90,78
          T100,78
          T103.696,78
        "
        fill="none"
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* 2) Masking rectangles */}
      <rect
        className={`${styles.mask} ${styles.left}`}
        x={-24.696}
        y={60}
        fill="#0b1121"
        stroke="none"
      />
      <rect
        className={`${styles.mask} ${styles.right}`}
        x={80.696}
        y={60}
        fill="#0b1121"
        stroke="none"
      />

      {/* 3) Face outline + eyes/eyebrows */}
      <g>
        <path d="M75.078,40.488c0,1.381-1.119,2.5-2.5,2.5s-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.698-3.701
                 c-2.044,0-3.703,1.66-3.703,3.701c0,1.381-1.119,2.5-2.5,2.5c-1.382,0-2.5-1.119-2.5-2.5
                 c0-4.797,3.903-8.701,8.703-8.701C71.176,31.786,75.078,35.691,75.078,40.488z
                 M29.953,40.461c0-4.798,3.904-8.7,8.703-8.7c4.797,0,8.701,3.902,8.701,8.7
                 c0,1.381-1.119,2.5-2.5,2.5c-1.381,0-2.5-1.119-2.5-2.5c0-2.04-1.66-3.7-3.701-3.7
                 c-2.043,0-3.703,1.66-3.703,3.7c0,1.381-1.119,2.5-2.5,2.5S29.953,41.842,29.953,40.461z
                 M66.376,51.847c-2.252,0-4.079-1.827-4.079-4.081c0-2.253,1.827-4.079,4.079-4.079
                 s4.078,1.826,4.078,4.079C70.455,50.02,68.628,51.847,66.376,51.847z
                 M42.732,47.766c0,2.254-1.826,4.081-4.078,4.081s-4.078-1.827-4.078-4.081
                 c0-2.253,1.826-4.079,4.078-4.079S42.732,45.513,42.732,47.766z
                 M85.465,103.695H18.23C8.178,103.695,0,95.518,0,85.465V18.23
                 C0,8.177,8.178,0,18.23,0h67.235c10.053,0,18.23,8.178,18.23,18.23
                 v67.235C103.696,95.518,95.518,103.695,85.467,103.695z
                 M18.23,8.577c-5.321,0-9.651,4.33-9.651,9.652v67.234
                 c0,5.322,4.33,9.652,9.651,9.652h67.235c5.321,0,9.651-4.33,9.651-9.652
                 V18.23c0-5.322-4.33-9.652-9.651-9.652L18.23,8.577L18.23,8.577z"/>
      </g>

      {/* 4) Three tear-drops */}
      <path
        className={styles.tear}
        d="M21.555,47.774c0,0,0.541,3.958-3.027,4.445c0,0-3.654,0.531-4.156-3.146
           c0,0-0.229-1.674,0.732-3.64c0,0,0.857-1.729,0.918-4.51
           C16.021,40.924,21.09,44.37,21.555,47.774z"
      />
      <path
        className={styles.tear}
        d="M73.901,21.309c1.219,1.818,1.219,3.508,1.219,3.508
           c0,3.711-3.693,3.678-3.693,3.678c-3.6,0-3.6-3.994-3.6-3.994
           c0-3.436,4.555-7.535,4.555-7.535C72.819,19.712,73.901,21.309,73.901,21.309z"
      />
      <path
        className={styles.tear}
        d="M89.848,56.793c0,3.711-3.693,3.678-3.693,3.678
           c-3.6,0-3.6-3.994-3.6-3.994c0-3.436,4.555-7.535,4.555-7.535
           c0.438,2.747,1.52,4.344,1.52,4.344C89.848,55.104,89.848,56.793,89.848,56.793z"
      />
    </svg>
  </div>
),
  error:    <>{<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 103.696 103.696" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M31.789,39.249l1.759-1.759l-1.76-1.761c-1.233-1.233-1.296-3.229-0.143-4.544c0.025-0.035,0.078-0.097,0.137-0.157 c1.277-1.278,3.46-1.27,4.718-0.011l1.76,1.759l1.76-1.76c1.198-1.199,3.267-1.262,4.544-0.145c0.041,0.03,0.106,0.086,0.167,0.146 c0.629,0.629,0.976,1.465,0.977,2.354c0,0.89-0.346,1.727-0.976,2.356l-1.76,1.76l1.758,1.759c0.63,0.629,0.977,1.466,0.977,2.355 c0,0.89-0.346,1.727-0.976,2.357c-1.258,1.26-3.452,1.261-4.712,0L38.261,42.2l-1.758,1.758c-0.631,0.63-1.467,0.977-2.356,0.977 c-0.89,0-1.727-0.347-2.356-0.977C30.491,42.662,30.491,40.549,31.789,39.249z M59.906,39.234l1.759-1.759l-1.76-1.761 c-1.232-1.233-1.297-3.229-0.143-4.544c0.024-0.035,0.078-0.097,0.137-0.157c1.277-1.278,3.459-1.27,4.718-0.011l1.76,1.759 l1.761-1.76c1.197-1.199,3.267-1.262,4.543-0.145c0.041,0.03,0.106,0.086,0.168,0.146c0.629,0.629,0.976,1.465,0.977,2.354 c0,0.89-0.346,1.727-0.977,2.356l-1.76,1.76l1.758,1.759c0.631,0.629,0.978,1.466,0.978,2.355c0,0.89-0.347,1.727-0.976,2.357 c-1.258,1.26-3.453,1.261-4.713,0l-1.758-1.758l-1.758,1.758c-0.631,0.63-1.467,0.978-2.355,0.978 c-0.891,0-1.728-0.347-2.356-0.978C58.606,42.648,58.606,40.534,59.906,39.234z M28.997,72.504v-4.105c0-0.551,0.448-1,1-1 c1.268,0,3.809-0.975,4.904-2.504c0.188-0.262,0.491-0.416,0.813-0.416c0,0,0,0,0.001,0c0.323,0,0.625,0.156,0.813,0.418 c1.119,1.568,2.949,2.504,4.895,2.504c1.949,0,3.779-0.936,4.896-2.502c0.188-0.264,0.49-0.42,0.813-0.42c0,0,0,0,0.001,0 c0.322,0,0.625,0.156,0.813,0.418c1.124,1.568,2.957,2.504,4.902,2.504c1.947,0,3.778-0.936,4.899-2.504 c0.375-0.524,1.251-0.524,1.627,0c1.121,1.568,2.952,2.504,4.897,2.504c1.949,0,3.779-0.936,4.9-2.504 c0.188-0.262,0.49-0.418,0.813-0.418l0,0c0.321,0,0.625,0.156,0.813,0.418c1.094,1.529,3.633,2.504,4.899,2.504 c0.552,0,1,0.447,1,1v4.104c0,0.553-0.448,1-1,1c-1.666,0-4.097-0.933-5.688-2.4c-1.492,1.521-3.561,2.4-5.738,2.4 c-2.164,0-4.223-0.871-5.713-2.375c-1.489,1.504-3.547,2.375-5.713,2.375c-2.163,0-4.222-0.871-5.713-2.375 c-1.488,1.504-3.546,2.375-5.712,2.375c-2.176,0-4.244-0.88-5.735-2.4c-1.592,1.468-4.024,2.4-5.691,2.4 C29.445,73.504,28.997,73.057,28.997,72.504z M85.467,103.696H18.23C8.179,103.696,0,95.518,0,85.467V18.23 C0,8.178,8.179,0,18.23,0h67.235c10.053,0,18.23,8.178,18.23,18.23v67.235C103.697,95.518,95.518,103.696,85.467,103.696z M18.23,8.579c-5.321,0-9.651,4.33-9.651,9.651v67.235c0,5.321,4.33,9.651,9.651,9.651h67.235c5.321,0,9.651-4.33,9.651-9.651 V18.23c0-5.321-4.33-9.651-9.651-9.651H18.23z"></path> </g> </g></svg>}</>,
  user:     <>{<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 103.695 103.695" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M37.26,42.99c3.586,0,6.5-2.913,6.5-6.5c0-3.588-2.914-6.5-6.5-6.5c-3.588,0-6.5,2.912-6.5,6.5 C30.76,40.076,33.672,42.99,37.26,42.99z M37.26,31.99c2.48,0,4.5,2.019,4.5,4.5s-2.02,4.5-4.5,4.5c-2.482,0-4.5-2.019-4.5-4.5 S34.777,31.99,37.26,31.99z M35.26,36.49c0-1.104,0.896-2,2-2s2,0.896,2,2s-0.896,2-2,2S35.26,37.593,35.26,36.49z M65.098,42.99 c3.586,0,6.5-2.913,6.5-6.5c0-3.588-2.914-6.5-6.5-6.5c-3.588,0-6.5,2.912-6.5,6.5C58.598,40.076,61.51,42.99,65.098,42.99z M65.098,31.99c2.48,0,4.5,2.019,4.5,4.5s-2.02,4.5-4.5,4.5c-2.481,0-4.5-2.019-4.5-4.5S62.616,31.99,65.098,31.99z M63.098,36.49 c0-1.104,0.896-2,2-2c1.104,0,2,0.896,2,2s-0.896,2-2,2C63.994,38.49,63.098,37.593,63.098,36.49z M73.537,76.368 c-22.713,20.021-43.377,0-43.377,0c0-11.55,9.711-20.913,21.688-20.913S73.537,64.818,73.537,76.368z M85.467,103.695H18.23 C8.178,103.695,0,95.518,0,85.465V18.23C0,8.177,8.178,0,18.23,0h67.235c10.053,0,18.23,8.178,18.23,18.23v67.235 C103.696,95.518,95.518,103.695,85.467,103.695z M18.23,8.577c-5.321,0-9.651,4.33-9.651,9.652v67.234 c0,5.322,4.33,9.652,9.651,9.652h67.235c5.321,0,9.651-4.33,9.651-9.652V18.23c0-5.322-4.33-9.652-9.651-9.652L18.23,8.577 L18.23,8.577z"></path> </g> </g></svg>}</>,
  smile:    <>{<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 103.695 103.695" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M51.908,71.516c7.689,0,14.527-4.321,17.421-11.012c0.658-1.521,2.424-2.222,3.944-1.562 c1.521,0.658,2.22,2.424,1.562,3.945c-3.843,8.887-12.843,14.629-22.928,14.629c-10.301,0-19.354-5.771-23.064-14.703 c-0.636-1.529,0.089-3.285,1.62-3.922c0.376-0.156,0.766-0.23,1.15-0.23c1.176,0.001,2.292,0.697,2.771,1.852 C37.161,67.196,44.04,71.516,51.908,71.516z M26.999,30.164c0.073-1.101,1.01-1.938,2.125-1.863 c0.087,0.006,8.679,0.498,11.91-3.958c0.648-0.896,1.9-1.092,2.793-0.445c0.894,0.648,1.093,1.899,0.445,2.793 c-3.717,5.125-11.401,5.632-14.292,5.632c-0.636,0-1.039-0.024-1.119-0.03C27.76,32.219,26.926,31.266,26.999,30.164z M33.249,43.13c-0.744-1.023-1.189-2.279-1.189-3.643c0-3.424,2.777-6.201,6.2-6.201c3.424,0,6.2,2.777,6.2,6.201 c0,1.315-0.412,2.533-1.11,3.537c-1.127-1.549-2.949-2.561-5.011-2.561C36.23,40.464,34.369,41.521,33.249,43.13z M60.376,26.654 c-0.647-0.894-0.448-2.145,0.445-2.793c0.894-0.646,2.146-0.45,2.793,0.445c3.231,4.456,11.823,3.964,11.909,3.958 c1.117-0.074,2.053,0.763,2.125,1.863c0.074,1.102-0.76,2.055-1.862,2.128c-0.08,0.006-0.483,0.03-1.119,0.03 C71.777,32.285,64.094,31.779,60.376,26.654z M66.391,33.249c3.422,0,6.199,2.777,6.199,6.201c0,1.363-0.445,2.619-1.188,3.643 c-1.12-1.609-2.981-2.666-5.091-2.666c-2.062,0-3.883,1.012-5.01,2.561c-0.699-1.004-1.111-2.222-1.111-3.537 C60.189,36.027,62.967,33.249,66.391,33.249z M85.467,103.695H18.23C8.178,103.695,0,95.518,0,85.465V18.23 C0,8.177,8.178,0,18.23,0h67.235c10.053,0,18.23,8.178,18.23,18.23v67.235C103.696,95.518,95.518,103.695,85.467,103.695z M18.23,8.577c-5.321,0-9.651,4.33-9.651,9.652v67.234c0,5.322,4.33,9.652,9.651,9.652h67.235c5.321,0,9.651-4.33,9.651-9.652 V18.23c0-5.322-4.33-9.652-9.651-9.652L18.23,8.577L18.23,8.577z"></path> </g> </g></svg>}</>,
  tired:    <>{<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 103.695 103.695" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M63.098,71.695c0,10.02-2.822,18.143-9.998,18.143c-7.178,0-8.001-8.123-8.001-18.143c0-10.014,0.823-18.139,8.001-18.139 C60.276,53.557,63.098,61.682,63.098,71.695z M43.99,37.489c0,1.737-1.409,3.147-3.147,3.147H27.471 c-1.738,0-3.147-1.41-3.147-3.147s1.409-3.147,3.147-3.147h13.372C42.581,34.341,43.99,35.751,43.99,37.489z M79.372,37.49 c0,1.737-1.409,3.146-3.147,3.146H62.852c-1.736,0-3.146-1.409-3.146-3.146c0-1.738,1.41-3.147,3.146-3.147h13.373 C77.963,34.342,79.372,35.751,79.372,37.49z M85.467,103.695H18.23C8.178,103.695,0,95.518,0,85.465V18.23C0,8.177,8.178,0,18.23,0 h67.235c10.053,0,18.23,8.178,18.23,18.23v67.235C103.696,95.518,95.518,103.695,85.467,103.695z M18.23,8.577 c-5.321,0-9.651,4.33-9.651,9.652v67.234c0,5.322,4.33,9.652,9.651,9.652h67.235c5.321,0,9.651-4.33,9.651-9.652V18.23 c0-5.322-4.33-9.652-9.651-9.652L18.23,8.577L18.23,8.577z"></path> </g> </g></svg>}</>,
  sleep:    <>{<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 103.696 103.695" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M27.46,36.897c0-0.418,0.043-0.825,0.107-1.226c0.588,3.619,3.719,6.385,7.5,6.385c3.783,0,6.914-2.766,7.5-6.385 c0.064,0.4,0.107,0.808,0.107,1.226c0,4.204-3.406,7.611-7.607,7.611C30.869,44.508,27.46,41.101,27.46,36.897z M61.963,36.897 c0-0.418,0.045-0.825,0.108-1.226c0.588,3.619,3.719,6.385,7.5,6.385c3.782,0,6.912-2.766,7.5-6.385 c0.063,0.4,0.106,0.808,0.106,1.226c0,4.204-3.406,7.611-7.606,7.611C65.371,44.508,61.963,41.101,61.963,36.897z M42.023,68.207 h19.649c1.303,0,2.356,1.631,2.356,3.641s-1.056,3.641-2.356,3.641H42.023c-1.301,0-2.357-1.631-2.357-3.641 C39.666,69.838,40.723,68.207,42.023,68.207z M85.465,103.695H18.23C8.178,103.695,0,95.518,0,85.465V18.23 C0,8.177,8.179,0,18.23,0h67.235c10.053,0,18.229,8.178,18.229,18.23v67.235C103.696,95.518,95.518,103.695,85.465,103.695z M18.23,8.577c-5.322,0-9.652,4.33-9.652,9.652v67.234c0,5.322,4.33,9.652,9.652,9.652h67.235c5.321,0,9.651-4.33,9.651-9.652 V18.23c0-5.322-4.33-9.652-9.651-9.652L18.23,8.577L18.23,8.577z"></path> </g> </g></svg>}</>,
};


export default function ChatPage() {
  const [userId, setUserId]         = useState("");
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [open, setOpen]             = useState(false);
  const [isBotTyping, setBotTyping] = useState(false);

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
      setTimeout(() => setIdleState("smile"), 5_000),
      setTimeout(() => setIdleState("tired"), 10_000),
      setTimeout(() => setIdleState("sleep"), 15_000)
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
    if (!open && messages.length === 0) {
      addMessage({
        text: "Hei! Jeg er Vintra sin AI-assistent. Hva kan jeg hjelpe med?",
        sender: "bot",
        icon: "inactive",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const txt = input.trim();
    if (!txt || !userId) return;

    addMessage({ text: txt, sender: "user", icon: "user" });
    setInput("");
    setBotTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: txt }),
      });
      const { reply } = await res.json();
      setTimeout(() => {
        setBotTyping(false);
        addMessage({
          text: reply ?? "Ingen svar fra boten.",
          sender: "bot",
          icon: "inactive",
        });
      }, 1500);
    } catch {
      setTimeout(() => {
        setBotTyping(false);
        addMessage({
          text: "Noe gikk galt…",
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

          <div ref={scrollRef} className={`${styles.messages} ${styles[atEdge]}`}>
            {messages.map((m, i) => {
              const isLastBot = i === lastBotIndex;
              const showAvatar =
                m.sender === "bot" && isLastBot && !isBotTyping;

              // pick which face to show over last bot bubble
              const avatarIcon = isUserTyping
                ? SVG_ICONS.user
                : idleState !== "none" && messages.length > 0 && isLastBot
                ? SVG_ICONS[idleState]
                : SVG_ICONS[m.icon];

              return (
                <div
                  key={i}
                  className={`${styles.messageRow} ${
                    m.sender === "user" ? styles.messageRowUser : styles.messageRowBot
                  }`}
                >
                  {showAvatar && (
                    <div className={styles.avatar}>{avatarIcon}</div>
                  )}
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

            {/* Bot typing row */}
            {isBotTyping && (
              <div className={`${styles.messageRow} ${styles.messageRowBot}`}>
                <div className={styles.avatar}>{SVG_ICONS.writing}</div>
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv melding…"
              className={styles.input}
              autoComplete="off"
            />
            <button type="submit" className={styles.button}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}