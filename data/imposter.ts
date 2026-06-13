/**
 * Who's the Imposter content.
 * Everyone sees `word`; the imposter sees only `clue` — a vaguer hint
 * so they can try to blend into the discussion without knowing the word.
 */
export type ImposterEntry = { word: string; clue: string };

export type ImposterPack = {
  id: string;
  name: string;
  entries: ImposterEntry[];
};

export const IMPOSTER_PACKS: ImposterPack[] = [
  {
    id: 'everyday',
    name: 'Everyday',
    entries: [
      { word: 'Toothbrush', clue: 'Bathroom item' },
      { word: 'Umbrella', clue: 'Used in bad weather' },
      { word: 'Pillow', clue: 'Found in a bedroom' },
      { word: 'Backpack', clue: 'You carry it' },
      { word: 'Candle', clue: 'Makes light' },
      { word: 'Mirror', clue: 'You look into it' },
      { word: 'Scissors', clue: 'A cutting tool' },
      { word: 'Wallet', clue: 'Holds money' },
      { word: 'Alarm clock', clue: 'Wakes you up' },
      { word: 'Sunglasses', clue: 'Worn on the face' },
      { word: 'Blanket', clue: 'Keeps you warm' },
      { word: 'Key', clue: 'Opens something' },
    ],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    entries: [
      { word: 'Pizza', clue: 'A savory meal' },
      { word: 'Ice cream', clue: 'A cold dessert' },
      { word: 'Coffee', clue: 'A morning drink' },
      { word: 'Sushi', clue: 'Often eaten cold' },
      { word: 'Pancakes', clue: 'A breakfast food' },
      { word: 'Burger', clue: 'Fast food' },
      { word: 'Watermelon', clue: 'A summer fruit' },
      { word: 'Spaghetti', clue: 'An Italian dish' },
      { word: 'Popcorn', clue: 'A movie snack' },
      { word: 'Chocolate', clue: 'A sweet treat' },
      { word: 'Tacos', clue: 'A handheld meal' },
      { word: 'Lemonade', clue: 'A cold drink' },
    ],
  },
  {
    id: 'places',
    name: 'Places',
    entries: [
      { word: 'Beach', clue: 'A vacation spot' },
      { word: 'Library', clue: 'A quiet place' },
      { word: 'Airport', clue: 'You travel from here' },
      { word: 'Hospital', clue: 'You go when sick' },
      { word: 'Gym', clue: 'A place to be active' },
      { word: 'Museum', clue: 'You look at things here' },
      { word: 'Restaurant', clue: 'You eat out here' },
      { word: 'Mountain', clue: 'Outdoors, high up' },
      { word: 'School', clue: 'A place to learn' },
      { word: 'Zoo', clue: 'Has animals' },
      { word: 'Cinema', clue: 'Entertainment venue' },
      { word: 'Park', clue: 'Open outdoor space' },
    ],
  },
  {
    id: 'screen',
    name: 'Movies & Shows',
    entries: [
      { word: 'Titanic', clue: 'A famous movie' },
      { word: 'Harry Potter', clue: 'A fantasy series' },
      { word: 'Friends', clue: 'A sitcom' },
      { word: 'Star Wars', clue: 'Set in space' },
      { word: 'The Office', clue: 'A workplace comedy' },
      { word: 'Frozen', clue: 'An animated film' },
      { word: 'Breaking Bad', clue: 'A drama series' },
      { word: 'Avengers', clue: 'A superhero movie' },
      { word: 'Squid Game', clue: 'A thriller series' },
      { word: 'Spider-Man', clue: 'A comic-book hero' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    entries: [
      { word: 'Penguin', clue: 'Lives in the cold' },
      { word: 'Elephant', clue: 'A large animal' },
      { word: 'Dolphin', clue: 'Lives in water' },
      { word: 'Kangaroo', clue: 'It hops' },
      { word: 'Owl', clue: 'Active at night' },
      { word: 'Giraffe', clue: 'Very tall' },
      { word: 'Shark', clue: 'A predator' },
      { word: 'Butterfly', clue: 'It can fly' },
      { word: 'Snake', clue: 'No legs' },
      { word: 'Panda', clue: 'Black and white' },
    ],
  },
];
