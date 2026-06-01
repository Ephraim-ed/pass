import { useRef, useState } from 'react';
import { DARES, TRUTHS } from '@/data/prompts';

export type SpinPhase = 'intro' | 'spin' | 'result';
export type PromptType = 'truth' | 'dare';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useSpinGame(players: string[]) {
  const [phase, setPhase] = useState<SpinPhase>('intro');
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [promptType, setPromptType] = useState<PromptType>('truth');
  const [prompt, setPrompt] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const currentAngle = useRef(0);
  const truthIdx = useRef(0);
  const dareIdx = useRef(0);

  function spin(onAngle: (finalAngle: number, spins: number) => void) {
    if (isSpinning || players.length < 2) return;
    setIsSpinning(true);
    setPhase('spin');

    const idx = randomInt(0, players.length - 1);
    const spins = randomInt(5, 7);
    const playerCount = players.length;
    const targetDeg = (idx / playerCount) * 360 - 90;
    const finalAngle =
      currentAngle.current -
      (currentAngle.current % 360) +
      spins * 360 +
      targetDeg +
      90;

    currentAngle.current = finalAngle;
    setTargetIndex(idx);
    onAngle(finalAngle, spins);

    setTimeout(() => {
      setIsSpinning(false);
    }, 3400);
  }

  function pickTruth() {
    const pool = TRUTHS;
    setPrompt(pool[truthIdx.current % pool.length]);
    truthIdx.current += 1;
    setPromptType('truth');
    setPhase('result');
  }

  function pickDare() {
    const pool = DARES;
    setPrompt(pool[dareIdx.current % pool.length]);
    dareIdx.current += 1;
    setPromptType('dare');
    setPhase('result');
  }

  function reroll() {
    const pool = promptType === 'truth' ? TRUTHS : DARES;
    const ref = promptType === 'truth' ? truthIdx : dareIdx;
    setPrompt(pool[ref.current % pool.length]);
    ref.current += 1;
  }

  function startGame() {
    setPhase('spin');
  }

  function reset() {
    setPhase('spin');
    setTargetIndex(null);
  }

  return {
    phase,
    targetIndex,
    promptType,
    prompt,
    isSpinning,
    startGame,
    spin,
    pickTruth,
    pickDare,
    reroll,
    reset,
    players,
  };
}
