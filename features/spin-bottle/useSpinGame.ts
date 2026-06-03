import { useRef, useState } from 'react';
import { DARES, TRUTHS } from '@/data/prompts';

export type SpinPhase = 'intro' | 'spin' | 'result';
export type PromptType = 'truth' | 'dare';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// velocity (px/s) → animation duration (ms) + extra spins
function spinParamsFromVelocity(velocity: number): { duration: number; spins: number } {
  const speed = Math.min(velocity, 3000);
  const duration = Math.max(900, Math.round(3200 - speed * 0.77));
  // tap (0) gets a random 5-7; swipes ramp up from 5 to 9
  const spins = velocity === 0
    ? randomInt(5, 7)
    : 5 + Math.min(Math.floor(speed / 600), 4);
  return { duration, spins };
}

export function useSpinGame(players: string[]) {
  const [phase, setPhase] = useState<SpinPhase>('intro');
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [promptType, setPromptType] = useState<PromptType>('truth');
  const [prompt, setPrompt] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [round, setRound] = useState(1);
  const currentAngle = useRef(0);
  const truthIdx = useRef(0);
  const dareIdx = useRef(0);

  function spin(
    velocity: number,
    onAngle: (finalAngle: number, duration: number) => void,
  ) {
    if (isSpinning || players.length < 2) return;
    setIsSpinning(true);
    setPhase('spin');

    const { duration, spins } = spinParamsFromVelocity(velocity);
    const idx = randomInt(0, players.length - 1);
    const targetDeg = (idx / players.length) * 360 - 90;
    const finalAngle =
      currentAngle.current -
      (currentAngle.current % 360) +
      spins * 360 +
      targetDeg +
      90;

    currentAngle.current = finalAngle;
    setTargetIndex(idx);
    onAngle(finalAngle, duration);

    setTimeout(() => setIsSpinning(false), duration + 200);
  }

  function pickTruth() {
    setPrompt(TRUTHS[truthIdx.current % TRUTHS.length]);
    truthIdx.current += 1;
    setPromptType('truth');
    setPhase('result');
  }

  function pickDare() {
    setPrompt(DARES[dareIdx.current % DARES.length]);
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

  function startGame() { setPhase('spin'); }

  function reset() {
    setPhase('spin');
    setTargetIndex(null);
    setRound((r) => r + 1);
  }

  function resetToIntro() {
    setPhase('intro');
    setTargetIndex(null);
    setRound(1);
    currentAngle.current = 0;
  }

  return {
    phase, targetIndex, promptType, prompt, isSpinning, round,
    startGame, spin, pickTruth, pickDare, reroll, reset, resetToIntro,
    players,
  };
}
