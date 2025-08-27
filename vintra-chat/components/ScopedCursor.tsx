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
  $visible: boolean;
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
    opacity 120ms ease,
    filter 120ms ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

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

/** Accept any ref-like object with `current: HTMLElement | null` */
type ScopeRef = { current: HTMLElement | null };

type Props = {
  scopeRef: ScopeRef;
};

const INTERACTIVE_SELECTOR =
  'a,button,[role="button"],input,select,textarea,label,[data-clickable="true"],.clickable';

export default function ScopedCursor({ scopeRef }: Props) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [inside, setInside] = useState(false);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const scope = scopeRef.current;
    const ring = ringRef.current;
    if (!scope || !ring) return;

    const onEnter = () => {
      setInside(true);
      scope.classList.add("cursorScope"); // hide native cursor inside scope
    };
    const onLeave = () => {
      setInside(false);
      setActive(false);
      scope.classList.remove("cursorScope");
      ring.style.transform = "translate3d(-100px,-100px,0)";
    };
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

    scope.addEventListener("mouseenter", onEnter);
    scope.addEventListener("mouseleave", onLeave);
    scope.addEventListener("mousemove", onMove);
    scope.addEventListener("mousedown", onDown);
    scope.addEventListener("mouseup", onUp);

    return () => {
      scope.removeEventListener("mouseenter", onEnter);
      scope.removeEventListener("mouseleave", onLeave);
      scope.removeEventListener("mousemove", onMove);
      scope.removeEventListener("mousedown", onDown);
      scope.removeEventListener("mouseup", onUp);
      scope.classList.remove("cursorScope");
    };
  }, [scopeRef]);

  return <Ring ref={ringRef} $hover={hover} $active={active} $visible={inside} aria-hidden />;
}
