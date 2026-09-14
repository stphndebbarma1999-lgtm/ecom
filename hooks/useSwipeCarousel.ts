"use client";

import { useEffect, useRef, useState } from "react";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

/**
 * Drives a touch-swipeable, auto-advancing carousel: index state, live drag
 * offset (for a finger-following slide), and auto-advance that pauses while
 * the user is actively swiping.
 */
export function useSwipeCarousel(length: number) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (length < 2 || isDragging) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [length, isDragging]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (length < 2) return;
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    setDragX(e.touches[0].clientX - startX.current);
  };

  const onTouchEnd = () => {
    if (startX.current === null) return;
    if (dragX < -SWIPE_THRESHOLD_PX) {
      setIndex((i) => (i + 1) % length);
    } else if (dragX > SWIPE_THRESHOLD_PX) {
      setIndex((i) => (i - 1 + length) % length);
    }
    startX.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  return {
    index,
    setIndex,
    dragX,
    isDragging,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
