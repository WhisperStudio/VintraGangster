"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Ring = styled.div<{ $hover: boolean; $active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ $active, $hover }) => ($active ? 18 : $hover ? 22 : 20)}px;
  height: ${({ $active, $hover }) => ($active ? 18 : $hover ? 22 : 20)}px;
  border-radius: 50%;
  border: 2px solid
    ${({ $active, $hover }) =>
      $active ? "#3bb4ff" : $hover ? "#b40f3a" : "white"};
  pointer-events: none;
  transform: translate3d(-100px, -100px, 0);
  transition: transform 16ms linear;
  z-index: 999999;
`;

export default function IframeCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ring = ref.current;
    if (!ring) return;

    const handler = (event: MessageEvent) => {
      const { type, x, y, down } = event.data || {};

      if (type === "cursor-move" && typeof x === "number" && typeof y === "number") {
        const size = ring.offsetWidth;
        ring.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
        setHover(false); // Kan evt. sende hover-state fra parent også
        setActive(down);
      }

      if (type === "cursor-down") setActive(true);
      if (type === "cursor-up") setActive(false);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return <Ring ref={ref} $hover={hover} $active={active} />;
}
