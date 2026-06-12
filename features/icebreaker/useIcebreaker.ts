import { useRef, useState } from 'react';
import { getPacksForDeck } from '@/data/packs';
import { PromptDeck, createPromptDeck } from '@/utils/promptDeck';

export type IcebreakerPhase = 'intro' | 'playing';

const ALL_PACKS = getPacksForDeck('icebreaker');

export function useIcebreaker(players: string[]) {
  const [phase, setPhase] = useState<IcebreakerPhase>('intro');
  const [playerIdx, setPlayerIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState('');
  const [selectedPacks, setSelectedPacks] = useState<string[]>(ALL_PACKS.map((p) => p.id));

  const deckRef = useRef<PromptDeck | null>(null);

  function togglePack(id: string) {
    setSelectedPacks((prev) => {
      if (prev.includes(id)) {
        // Always keep at least one pack selected
        return prev.length > 1 ? prev.filter((p) => p !== id) : prev;
      }
      return [...prev, id];
    });
  }

  function start() {
    deckRef.current = createPromptDeck('icebreaker', { packIds: selectedPacks });
    setPlayerIdx(0);
    setRound(1);
    setQuestion(deckRef.current.draw());
    setPhase('playing');
  }

  function next() {
    setPlayerIdx((i) => (i + 1) % players.length);
    setQuestion(deckRef.current?.draw() ?? '');
    setRound((r) => r + 1);
  }

  function skip() {
    setQuestion(deckRef.current?.draw() ?? '');
  }

  const currentPlayer = players[playerIdx] ?? '';
  const nextPlayer = players[(playerIdx + 1) % players.length] ?? '';

  return {
    phase, round, question, currentPlayer, nextPlayer,
    packs: ALL_PACKS, selectedPacks, togglePack,
    start, next, skip,
  };
}
