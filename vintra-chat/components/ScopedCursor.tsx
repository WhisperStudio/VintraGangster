"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

/** Colors */
const RING_RED = "#b40f3a";
const RING_RED_GLOW = "rgba(180,15,58,.55)";
const RING_BLUE = "#3bb4ff";
const RING_BLUE_GLOW = "rgba(59,180,255,.55)";

type RingProps = {
  $hover: boolean;
  $active: boolean;
};

const Ring = styled.div<RingProps>`
  position: fixed;
  z-index: 999999;
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
    background-color 120ms ease,
    filter 120ms ease;

  border: 2px solid
    ${({ $active, $hover }) => ($active ? RING_BLUE : $hover ? RING_RED : "#ffffff")};

  background: ${({ $active, $hover }) =>
    $active
      ? "radial-gradient(transparent 60%, rgba(59,180,255,.10))"
      : $hover
      ? "radial-gradient(transparent 60%, rgba(180,15,58,.12))"
      : "transparent"};

  box-shadow:
    0 0 0 1px rgba(255,255,255,.03) inset,
    ${({ $active, $hover }) =>
      $active
        ? `0 0 16px ${RING_BLUE_GLOW}`
        : $hover
        ? `0 0 14px ${RING_RED_GLOW}`
        : "0 0 8px rgba(255,255,255,.25)"};

  @media (max-width: 768px) { display: none; }
`;

const INTERACTIVE_SELECTOR =
  'a,button,[role="button"],input,select,textarea,label,[data-clickable="true"],.clickable';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    document.body.style.cursor = "none"; // skjul native cursor i hele dokumentet

    const onMove = (e: MouseEvent) => {
      const size = ring.offsetWidth;
      ring.style.transform = `translate3d(${e.clientX - size / 2}px, ${
        e.clientY - size / 2
      }px, 0)`;

      const t = e.target as Element | null;
      setHover(!!t?.closest(INTERACTIVE_SELECTOR));
    };
    const onDown = () => setActive(true);
    const onUp = () => setActive(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return <Ring ref={ringRef} $hover={hover} $active={active} aria-hidden />;
}
