import { useRef, useState } from 'react';
import { ICEBREAKERS } from '@/data/prompts';

export type IcebreakerPhase = 'intro' | 'playing';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useIcebreaker(players: string[]) {
  const [phase, setPhase] = useState<IcebreakerPhase>('intro');
  const [playerIdx, setPlayerIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState('');

  // Shuffled deck; reshuffles only when exhausted so nothing repeats early
  const deck = useRef<string[]>(shuffle(ICEBREAKERS));
  const deckPos = useRef(0);

  function draw(): string {
    if (deckPos.current >= deck.current.length) {
      deck.current = shuffle(ICEBREAKERS);
      deckPos.current = 0;
    }
    const q = deck.current[deckPos.current];
    deckPos.current += 1;
    return q;
  }

  function start() {
    setPlayerIdx(0);
    setRound(1);
    setQuestion(draw());
    setPhase('playing');
  }

  function next() {
    setPlayerIdx((i) => (i + 1) % players.length);
    setQuestion(draw());
    setRound((r) => r + 1);
  }

  function skip() {
    setQuestion(draw());
  }

  const currentPlayer = players[playerIdx] ?? '';
  const nextPlayer = players[(playerIdx + 1) % players.length] ?? '';

  return { phase, round, question, currentPlayer, nextPlayer, start, next, skip };
}
