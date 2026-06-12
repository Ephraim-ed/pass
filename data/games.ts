import { COLORS } from '@/theme/tokens';

export type Game = {
  id: string;
  name: string;
  tag: string;
  mins: number;
  color: string;
  cat: 'classic' | 'social' | 'word' | 'creative';
  age: '18+' | 'all';
};

export const GAMES: Game[] = [
  { id: 'icebreaker',   name: 'Icebreakers',         tag: '2–12', mins: 10, color: COLORS.mint,   cat: 'social',   age: 'all' },
  { id: 'truth_dare',   name: 'Truth or Dare',       tag: '2–10', mins: 15, color: COLORS.pink,   cat: 'classic',  age: '18+' },
  { id: 'spin_bottle',  name: 'Spin the Bottle',     tag: '3–12', mins: 10, color: '#D92020',     cat: 'classic',  age: '18+' },
  { id: 'drawing',      name: 'Doodle Duel',         tag: '2–8',  mins: 20, color: COLORS.yellow, cat: 'creative', age: 'all' },
  { id: 'guess_word',   name: 'Guess the Word',      tag: '3–8',  mins: 15, color: COLORS.tomato, cat: 'word',     age: 'all' },
  { id: 'guess_movie',  name: 'Name That Movie',     tag: '3–10', mins: 15, color: COLORS.purple, cat: 'word',     age: 'all' },
  { id: 'word_chain',   name: 'Word Chain',          tag: '2–10', mins: 10, color: COLORS.sky,    cat: 'word',     age: 'all' },
  { id: 'imposter',     name: "Who's the Imposter",  tag: '4–10', mins: 12, color: COLORS.tomato, cat: 'social',   age: 'all' },
  { id: 'never_have',   name: 'Never Have I Ever',   tag: '3–12', mins: 15, color: COLORS.purple, cat: 'social',   age: '18+' },
  { id: 'most_likely',  name: 'Most Likely To',      tag: '4–12', mins: 10, color: COLORS.yellow, cat: 'social',   age: 'all' },
  { id: 'charades',     name: 'Charades',            tag: '4–12', mins: 20, color: COLORS.mint,   cat: 'classic',  age: 'all' },
  { id: 'would_rather', name: 'Would You Rather',    tag: '2–10', mins: 10, color: COLORS.sky,    cat: 'social',   age: 'all' },
];

export type CategoryId = 'all' | 'classic' | 'social' | 'word' | 'creative';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'classic',  label: 'Classics' },
  { id: 'social',   label: 'Get-to-know' },
  { id: 'word',     label: 'Word' },
  { id: 'creative', label: 'Creative' },
];
