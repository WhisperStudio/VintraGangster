"use client";
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

/* Skjul den originale cursoren */
const HideNativeCursor = createGlobalStyle`
  html, body, * { cursor: none !important; }
`;

/* Farger */
const RING_RED = "#b40f3a"; // hover
const RING_RED_GLOW = "rgba(180,15,58,.55)";
const RING_BLUE = "#3bb4ff"; // active
const RING_BLUE_GLOW = "rgba(59,180,255,.55)";

const Ring = styled.div<{ $hover: boolean; $active: boolean }>`
  position: fixed;
  z-index: 99999;
  width: ${({ $active, $hover }) => ($active ? 18 : $hover ? 22 : 20)}px;
  height: ${({ $active, $hover }) => ($active ? 18 : $hover ? 22 : 20)}px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate3d(-100px, -100px, 0);
  transition:
    transform 16ms linear,
    width 80ms ease, height 80ms ease,
    border-color 80ms ease,
    box-shadow 120ms ease,
    background-color 120ms ease;

  /* Kantfarge */
  border: 2px solid
    ${({ $active, $hover }) =>
      $active ? RING_BLUE : $hover ? RING_RED : "#ffffff"};

  /* Bakgrunnsfyll */
  background: ${({ $active, $hover }) =>
    $active
      ? "radial-gradient(transparent 60%, rgba(59,180,255,.10))"
      : $hover
      ? "radial-gradient(transparent 60%, rgba(180,15,58,.12))"
      : "transparent"};

  /* Glød */
  box-shadow:
    0 0 0 1px rgba(255,255,255,.03) inset,
    ${({ $active, $hover }) =>
      $active
        ? `0 0 16px ${RING_BLUE_GLOW}`
        : $hover
        ? `0 0 14px ${RING_RED_GLOW}`
        : "0 0 8px rgba(255,255,255,.25)"};

  @media (max-width: 768px) {
    display: none;
  }
`;

const INTERACTIVE_SELECTOR =
  'a,button,[role="button"],input,select,textarea,label,[data-clickable="true"],.clickable';

export default function GlobalCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ring = ref.current;
    if (!ring) return;

    const onMove = (e: MouseEvent) => {
      const size = ring.offsetWidth;
      ring.style.transform = `translate3d(${e.clientX - size / 2}px, ${
        e.clientY - size / 2
      }px, 0)`;

      const target = e.target as Element | null;
      setHover(!!target?.closest(INTERACTIVE_SELECTOR));
    };

    const onDown = () => setActive(true);
    const onUp = () => setActive(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <HideNativeCursor />
      <Ring ref={ref} $hover={hover} $active={active} />
    </>
  );
}
