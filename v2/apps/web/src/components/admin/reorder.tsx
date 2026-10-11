"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

export function moveItem<T>(items: T[], index: number, delta: -1 | 1) {
  const target = index + delta;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function ReorderButtons({
  index,
  count,
  onMove,
  disabled,
}: {
  index: number;
  count: number;
  onMove: (delta: -1 | 1) => void;
  disabled?: boolean;
}) {
  const buttonClass =
    "inline-flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-sand hover:text-navy disabled:pointer-events-none disabled:opacity-30";
  return (
    <span className="flex shrink-0">
      <button type="button" className={buttonClass} disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label="Move up">
        <ArrowUp className="size-4" />
      </button>
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || index === count - 1}
        onClick={() => onMove(1)}
        aria-label="Move down"
      >
        <ArrowDown className="size-4" />
      </button>
    </span>
  );
}
