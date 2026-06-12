/** Which game/question pool a pack feeds. Extend when a new question game is added. */
export type DeckType = 'truth' | 'dare' | 'icebreaker';

export type PromptPack = {
  id: string;
  name: string;
  /** Short blurb shown in pack pickers. */
  description: string;
  deck: DeckType;
  age: '18+' | 'all';
  prompts: string[];
};
