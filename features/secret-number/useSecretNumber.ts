// ── Phase machine & game state hook ──
//
// This is the ONLY file that manages state for the Secret Number game.
// Every phase component receives its data and callbacks through props.
// No useState or game logic lives inside phase components.
//
// Flow:  rules → category → distribution → sorting → results
//          ↑                                              │
//          └──────────────── reset ───────────────────────┘
//
// Note: players pick only a CATEGORY (e.g. "Food"). They come up with
// their own subject within that category during the discussion phase.
// No predefined subject lists — the game is fully open-ended.

import { useState } from 'react';
import type { SecretNumberPhase, PlayerAssignment, CategoryId } from './types';

// -- Helpers ------------------------------------------------------

/** Fisher-Yates shuffle. Returns a new array; does not mutate the input. */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks `count` unique integers from 1–100.
 * Shuffles the full 1–100 pool and slices the first `count`.
 * No Set-tracking or collision retries — guaranteed O(n) and one-pass.
 */
function generateUniqueNumbers(count: number): number[] {
  const pool = Array.from({ length: 100 }, (_, i) => i + 1);
  return shuffleArray(pool).slice(0, count);
}

// -- Hook ---------------------------------------------------------

export function useSecretNumber(players: string[]) {
  // -- State --

  const [phase, setPhase] = useState<SecretNumberPhase>('rules');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [assignments, setAssignments] = useState<PlayerAssignment[]>([]);
  const [submittedOrder, setSubmittedOrder] = useState<PlayerAssignment[] | null>(null);

  // -- Derived --

  /** The correct answer key: assignments sorted by secret number ascending. */
  const correctOrder = [...assignments].sort((a, b) => a.number - b.number);

  // -- Actions --

  /** Assigns a unique random number (1–100) to each player.
   *  Players are sorted alphabetically so the reveal loop has a predictable order. */
  function generate() {
    const numbers = generateUniqueNumbers(players.length);
    const sorted = [...players].sort((a, b) => a.localeCompare(b));
    const result: PlayerAssignment[] = sorted.map((name, i) => ({
      name,
      number: numbers[i],
    }));
    setAssignments(result);
  }

  /** Locks in the drag-and-drop order from Phase 4 and jumps to results. */
  function finalize(order: PlayerAssignment[]) {
    setSubmittedOrder(order);
    setPhase('results');
  }

  /** Hard reset back to the rules screen. Wipes all game state. */
  function reset() {
    setPhase('rules');
    setCategory(null);
    setAssignments([]);
    setSubmittedOrder(null);
  }

  // -- Public API --

  return {
    // State
    phase,
    setPhase,
    players,
    category,
    assignments,
    submittedOrder,
    correctOrder,

    // Actions
    selectCategory: setCategory,
    generate,
    finalize,
    reset,
  };
}
