import { DeckType, PackFilter, getPrompts } from '@/data/packs';

export type PromptDeck = {
  /** Next prompt. Reshuffles automatically when the deck is exhausted. */
  draw: () => string;
  /** Total prompts in the deck. */
  size: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffled no-repeat deck over the packs matching `deck` + `opts`.
 * Nothing repeats until every prompt has been drawn once; then it
 * reshuffles, avoiding an immediate back-to-back repeat across the seam.
 */
export function createPromptDeck(deck: DeckType, opts: PackFilter = {}): PromptDeck {
  const prompts = getPrompts(deck, opts);
  let order = shuffle(prompts);
  let pos = 0;

  function draw(): string {
    if (prompts.length === 0) return '';
    if (pos >= order.length) {
      const last = order[order.length - 1];
      order = shuffle(prompts);
      // Avoid the same prompt twice in a row across the reshuffle boundary
      if (order.length > 1 && order[0] === last) {
        [order[0], order[1]] = [order[1], order[0]];
      }
      pos = 0;
    }
    return order[pos++];
  }

  return { draw, size: prompts.length };
}
