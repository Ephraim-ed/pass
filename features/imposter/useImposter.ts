import { useRef, useState } from 'react';
import { IMPOSTER_PACKS, ImposterEntry } from '@/data/imposter';

export type ImposterPhase = 'intro' | 'reveal' | 'discuss' | 'result';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useImposter(players: string[]) {
  const [phase, setPhase] = useState<ImposterPhase>('intro');
  const [selectedPacks, setSelectedPacks] = useState<string[]>(
    IMPOSTER_PACKS.map((p) => p.id),
  );
  const [imposterIdx, setImposterIdx] = useState(0);
  const [revealIdx, setRevealIdx] = useState(0);
  const [entry, setEntry] = useState<ImposterEntry>({ word: '', clue: '' });

  // Shuffled bag of entries so words don't repeat back-to-back across rounds
  const bag = useRef<ImposterEntry[]>([]);

  function refillBag() {
    const pool = IMPOSTER_PACKS
      .filter((p) => selectedPacks.includes(p.id))
      .flatMap((p) => p.entries);
    bag.current = shuffle(pool.length > 0 ? pool : IMPOSTER_PACKS.flatMap((p) => p.entries));
  }

  function drawEntry(): ImposterEntry {
    if (bag.current.length === 0) refillBag();
    return bag.current.pop() ?? { word: '', clue: '' };
  }

  function togglePack(id: string) {
    setSelectedPacks((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((p) => p !== id) : prev;
      }
      return [...prev, id];
    });
    bag.current = []; // force refill with the new selection
  }

  function startRound() {
    setEntry(drawEntry());
    setImposterIdx(randomInt(players.length));
    setRevealIdx(0);
    setPhase('reveal');
  }

  function nextReveal() {
    setRevealIdx((i) => {
      const next = i + 1;
      if (next >= players.length) {
        setPhase('discuss');
        return i;
      }
      return next;
    });
  }

  function revealResult() {
    setPhase('result');
  }

  function playAgain() {
    startRound();
  }

  function backToIntro() {
    setPhase('intro');
  }

  const currentPlayer = players[revealIdx] ?? '';
  const isImposter = revealIdx === imposterIdx;
  const isLastReveal = revealIdx === players.length - 1;
  const imposterName = players[imposterIdx] ?? '';

  return {
    phase,
    packs: IMPOSTER_PACKS,
    selectedPacks,
    togglePack,
    entry,
    currentPlayer,
    isImposter,
    isLastReveal,
    imposterName,
    revealIdx,
    playerCount: players.length,
    startRound,
    nextReveal,
    revealResult,
    playAgain,
    backToIntro,
  };
}
