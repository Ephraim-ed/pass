import { DARES_CLASSIC } from './dares';
import { ICEBREAKERS_EASY, ICEBREAKERS_GROUP, ICEBREAKERS_REAL_TALK } from './icebreakers';
import { TRUTHS_CLASSIC, TRUTHS_SPICY } from './truths';
import { DeckType, PromptPack } from './types';

export type { DeckType, PromptPack };

/** Registry of every available pack. Adding a pack = create it in a file here and list it. */
export const PACKS: PromptPack[] = [
  TRUTHS_CLASSIC,
  TRUTHS_SPICY,
  DARES_CLASSIC,
  ICEBREAKERS_EASY,
  ICEBREAKERS_REAL_TALK,
  ICEBREAKERS_GROUP,
];

export type PackFilter = {
  /** Restrict to these pack ids. Omit = all packs for the deck. */
  packIds?: string[];
  /** Include 18+ packs. Default false. */
  includeAdult?: boolean;
};

export function getPacksForDeck(deck: DeckType, opts: PackFilter = {}): PromptPack[] {
  return PACKS.filter((p) => {
    if (p.deck !== deck) return false;
    if (p.age === '18+' && !opts.includeAdult) return false;
    if (opts.packIds && !opts.packIds.includes(p.id)) return false;
    return true;
  });
}

/** All prompts from the matching packs, merged. */
export function getPrompts(deck: DeckType, opts: PackFilter = {}): string[] {
  return getPacksForDeck(deck, opts).flatMap((p) => p.prompts);
}
