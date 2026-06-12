# PASS — Developer Documentation

A pass-the-phone party game app built with Expo / React Native.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Libraries](#2-libraries)
3. [Theme System](#3-theme-system)
4. [Data Layer](#4-data-layer)
5. [State & Storage](#5-state--storage)
6. [Components](#6-components)
7. [Features](#7-features)
8. [Screens (app/)](#8-screens-app)
9. [Adding a New Game](#9-adding-a-new-game)

---

## 1. Project Structure

```
pass/
├── app/                        # expo-router file-based screens
│   ├── _layout.tsx             # Root layout: fonts, providers, splash screen
│   ├── index.tsx               # Launch gate → onboarding or home
│   ├── onboarding.tsx          # 3-step swipeable onboarding
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab shell (hides default tab bar)
│   │   ├── home.tsx            # Game grid, crew card, category filter
│   │   ├── crew.tsx            # Manage players
│   │   └── history.tsx         # Game history (stub)
│   └── game/
│       ├── spin-bottle.tsx     # Full Spin the Bottle game (intro → spin → result)
│       └── [id].tsx            # "Coming soon" screen for all other games
│
├── components/
│   ├── ui/                     # Reusable design-system primitives
│   │   ├── Sticker.tsx         # Gradient card with hard offset shadow
│   │   ├── StickerButton.tsx   # Pressable Sticker with press-down animation
│   │   ├── Dots.tsx            # Animated pagination dots
│   │   ├── SpeechBubble.tsx    # Rounded card with tail (used by Bub)
│   │   └── TabBar.tsx          # Floating ink pill bottom nav
│   ├── mascot/
│   │   └── Bub.tsx             # Animated SVG mascot, 6 poses
│   ├── game-icons/
│   │   └── GameIcon.tsx        # SVG pictogram switcher (one icon per game id)
│   └── shared/
│       ├── PlayerChip.tsx      # Pill showing a player's initial + name
│       └── CategoryPills.tsx   # Horizontal scroll filter bar
│
├── features/                   # Self-contained game modules
│   └── spin-bottle/
│       ├── useSpinGame.ts      # Game state & logic hook
│       ├── SpinWheel.tsx       # Orbital player layout + animated bottle
│       └── FlipCard.tsx        # 3D flip card to reveal prompt
│
├── theme/
│   ├── tokens.ts               # COLORS, FONTS, RADIUS constants
│   └── colors.ts               # lighten() / darken() helpers
│
├── data/
│   ├── games.ts                # GAMES array + CATEGORIES + Game type
│   └── prompts.ts              # TRUTHS and DARES arrays
│
├── store/
│   └── useApp.ts               # Global app state hook (AsyncStorage-backed)
│
└── utils/
    └── storage.ts              # loadItem / saveItem wrappers for AsyncStorage
```

---

## 2. Libraries

Versions track **Expo SDK 54** — `package.json` is authoritative; realign with `npx expo install --fix` after SDK changes.

| Library | Version | Purpose |
|---|---|---|
| `expo` | ^54.0.35 | SDK base |
| `expo-router` | ~6.0.24 | File-based navigation |
| `expo-font` | ~14.0.12 | Font loading |
| `expo-linear-gradient` | ~15.0.8 | Sticker gradient fill |
| `expo-haptics` | ~15.0.8 | Tactile feedback on button press and spin land |
| `expo-splash-screen` | ~31.0.13 | Hold splash until fonts are loaded |
| `expo-image-picker` | ~17.0.11 | Player avatar photos |
| `react-native-reanimated` | ~4.1.1 | Animations (Sticker press, Bub idle loops, bottle spin, flip card) |
| `react-native-gesture-handler` | ~2.28.0 | Pan gesture for onboarding swipe |
| `react-native-svg` | 15.12.1 | Game icons and Bub mascot |
| `react-native-safe-area-context` | ~5.6.0 | Notch / home indicator insets |
| `react-native-screens` | ~4.16.0 | Native screen optimisation for expo-router |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persisting app state between sessions |
| `@expo-google-fonts/bricolage-grotesque` | ^0.4.1 | Display font (headings) |
| `@expo-google-fonts/geist` | ^0.4.2 | UI font (body / buttons) |
| `@expo-google-fonts/geist-mono` | ^0.4.2 | Mono font (labels, badges) |
| `buffer` | ^6.0.3 | Node polyfill required by react-native-svg v15 |

### Key patterns to know

- **Reanimated worklets** — any code inside `useAnimatedStyle`, `withTiming` callbacks, or `Gesture.Pan().onEnd()` runs on the UI thread. Calling a JS function (e.g. `setState`, `Haptics`) from there requires `runOnJS(fn)()`.
- **Metro resolver** — `metro.config.js` maps the `buffer` package so react-native-svg can resolve it.
- **Babel** — `babel.config.js` loads `react-native-reanimated/plugin` last; this is required for worklet transforms to work.

---

## 3. Theme System

All design tokens live in `theme/tokens.ts`.

```ts
COLORS   // cream, ink, pink, yellow, purple, mint, tomato, sky, …
FONTS    // display (BricolageGrotesque 800), ui (Geist 600/700), mono (GeistMono 500)
RADIUS   // sm:14  md:18  lg:22  xl:26  pill:999
```

Color manipulation lives in `theme/colors.ts`:

```ts
lighten(hex, 0.35)  // mix with white by 35%
darken(hex, 0.22)   // mix with black by 22%
```

These are used by `Sticker` / `StickerButton` to compute the gradient stops from a single base colour. Every card/button in the app is just a base colour passed to `<Sticker color={…}>`.

---

## 4. Data Layer

### `data/games.ts`

Single source of truth for all games.

```ts
type Game = {
  id: string;           // used for routing and icon lookup
  name: string;
  tag: string;          // player count range e.g. "3–12"
  mins: number;
  color: string;        // base colour from COLORS
  cat: 'classic' | 'social' | 'word' | 'creative';
  age: '18+' | 'all';
};
```

The `id` field drives two things automatically:
- **Routing** — `app/game/[id].tsx` matches it, and `spin_bottle` maps to `app/game/spin-bottle.tsx`.
- **Icons** — `GameIcon` switches on `game.id` to render the right SVG.

### `data/packs/` — the prompt pack system

All question content lives in **packs**. A pack is a named, age-rated bundle of prompts that feeds one deck type:

```ts
// data/packs/types.ts
type DeckType = 'truth' | 'dare' | 'icebreaker';  // extend per new question game

type PromptPack = {
  id: string;
  name: string;          // shown in pack pickers
  description: string;
  deck: DeckType;
  age: '18+' | 'all';    // 18+ packs are excluded unless a game opts in
  prompts: string[];
};
```

- **Content files** — `truths.ts`, `dares.ts`, `icebreakers.ts` each export one or more packs.
- **Registry** — `data/packs/index.ts` lists every pack in `PACKS` and exposes:
  - `getPacksForDeck(deck, { packIds?, includeAdult? })` — pack metadata, for pickers
  - `getPrompts(deck, opts)` — merged prompt strings from matching packs

**Adding a pack** = add a `PromptPack` object in the matching content file (or a new file) and list it in `PACKS`. It immediately appears in any game using that deck type, including pack-picker UIs.

### `utils/promptDeck.ts` — the deck engine

`createPromptDeck(deck, opts)` returns `{ draw, size }`: a shuffled deck that never repeats a prompt until every prompt has been drawn once, then reshuffles (avoiding a back-to-back repeat across the boundary). Every question game should draw through this instead of indexing arrays.

```ts
const deck = createPromptDeck('icebreaker', { packIds: ['icebreakers_easy'] });
deck.draw(); // → next question
```

Games hold the deck in a `useRef` so it survives re-renders (see `useSpinGame` / `useIcebreaker`).

---

## 5. State & Storage

`store/useApp.ts` is a plain React hook — no external state library.

```ts
type AppState = {
  players: string[];          // active crew
  category: CategoryId;       // selected filter on home
  layout: 'grid'|'list'|'carousel';
  hasOnboarded: boolean;
};
```

Everything is automatically persisted to AsyncStorage under the key `pass_state` on every update via `utils/storage.ts`. On first mount the hook loads the saved state; components get a `loaded` boolean to gate rendering until the state is ready.

**Usage:**
```ts
const { state, addPlayer, removePlayer, setCategory, setOnboarded } = useApp();
```

---

## 6. Components

### `<Sticker color radius shadowY rotate>`

The core visual primitive. Renders a `LinearGradient` surface (lighter → base → darker) with a `2.5px` ink border and a solid offset shadow (an absolutely-positioned ink `View` shifted down by `shadowY`).

```tsx
<Sticker color={COLORS.mint} rotate={-2}>
  <Text>Content goes here</Text>
</Sticker>
```

### `<StickerButton color onPress …>`

Same as `Sticker` but `Pressable`. On press-in, the card shifts down 3px and the shadow shrinks to simulate pressing. Fires `Haptics.selectionAsync` on every press.

```tsx
<StickerButton color={COLORS.pink} onPress={() => router.push('/game/spin-bottle')}>
  <Text style={{ padding: 16 }}>Play</Text>
</StickerButton>
```

### `<Bub pose size color hat>`

Animated SVG mascot. Pose controls which arms/mouth variant is drawn.

| Pose | Used on |
|---|---|
| `idle` | History screen, generic stubs |
| `wave` | Onboarding step 1 |
| `point` | Onboarding step 2, Home featured card |
| `cheer` | Onboarding step 3 |
| `mic` | Spin result screen |
| `peek` | Home featured card corner |

All poses share: body sway, hat tilt, eye blink loops via Reanimated.

### `<GameIcon gameId size color>`

Switches on `gameId` to render a 64×64 SVG pictogram. Add a new case here when adding a new game.

### `<TabBar>`

Floating ink pill at the bottom. Reads the current pathname from `usePathname()` to highlight the active tab. No props needed — drop it at the bottom of any tab screen.

### `<PlayerChip name accentColor removable onRemove>`

Pill showing initial avatar + name. Set `removable` to show the × button (only shown when there are more than 2 players to maintain the minimum).

### `<CategoryPills active onSelect>`

Horizontal scrolling filter bar. Reads from `CATEGORIES` in `data/games.ts`.

### `<Dots total active>`

Animated pagination indicator. Active dot expands from 10px → 28px width.

---

## 7. Features

Each complete game lives in its own folder under `features/`. The pattern is:

```
features/
└── <game-id>/
    ├── use<GameName>.ts    # All game logic, state, and phase transitions
    ├── <SpecialWidget>.tsx # Any UI unique to this game
    └── …
```

### `features/spin-bottle/`

| File | Responsibility |
|---|---|
| `useSpinGame.ts` | Phase machine (`intro → spin → result`), spin math, prompt pools, truth/dare/reroll logic |
| `SpinWheel.tsx` | Orbital player layout, animated bottle, Spin! button |
| `FlipCard.tsx` | 3D flip card (front = type badge, back = prompt text) |

**Spin math** (from `useSpinGame.ts`):
```
targetDeg  = (targetIndex / playerCount) * 360 - 90
finalAngle = currentAngle - (currentAngle % 360) + spins*360 + targetDeg + 90
```
The bottle always lands on the same player regardless of how many full rotations it does.

---

## 8. Screens (app/)

| Screen | Path | Notes |
|---|---|---|
| Launch gate | `/` | Checks AsyncStorage; redirects to onboarding or home |
| Onboarding | `/onboarding` | 3 steps, swipe or tap Next. Sets `hasOnboarded` on finish. |
| Home | `/(tabs)/home` | Game grid, crew card, category filter, featured card |
| Crew | `/(tabs)/crew` | Full player list, add/remove |
| History | `/(tabs)/history` | Stub — "no games yet" |
| Spin the Bottle | `/game/spin-bottle` | Full game — intro, spin wheel, flip card result |
| Coming soon | `/game/[id]` | Catch-all for all other game IDs |

Navigation between tabs uses expo-router's `<Tabs>` shell but the native tab bar is hidden — `<TabBar>` renders instead as a floating pill at the bottom of each screen.

---

## 9. Adding a New Game

Follow these steps to add a fully wired game. Steps 1–3 make it appear in the grid automatically; steps 4–6 build the actual gameplay.

### Step 1 — Register the game in `data/games.ts`

```ts
{ id: 'my_game', name: 'My Game', tag: '2–8', mins: 15, color: COLORS.purple, cat: 'social', age: 'all' },
```

The `id` must be URL-safe (underscores are fine). The game will immediately appear in the home grid and in the correct category filter.

### Step 2 — Add an icon in `components/game-icons/GameIcon.tsx`

Add a new SVG component and a case in the `ICONS` map:

```tsx
function MyGameIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      {/* Your 64×64 SVG paths here */}
    </Svg>
  );
}

const ICONS: Record<string, React.FC<{ color: string }>> = {
  // … existing entries …
  my_game: MyGameIcon,
};
```

### Step 3 — Test the stub

Run the app. Tapping the new card routes to `app/game/[id].tsx` which shows the "coming soon" screen automatically. No routing code needed.

### Step 4 — Create the feature folder

```
features/
└── my-game/
    ├── useMyGame.ts       # Phase machine + all game logic
    └── MyGameBoard.tsx    # Game-specific UI (optional)
```

**`useMyGame.ts` pattern:**
```ts
export type MyGamePhase = 'intro' | 'playing' | 'result';

export function useMyGame(players: string[]) {
  const [phase, setPhase] = useState<MyGamePhase>('intro');
  // … state, helpers, etc.
  return { phase, start, next, reset, … };
}
```

Keep all game logic inside the hook. The screen only calls hook methods and renders based on `phase`.

### Step 5 — Create the screen

Create `app/game/my-game.tsx` (use hyphens in the filename, matching the route).

```tsx
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useApp } from '@/store/useApp';
import { useMyGame } from '@/features/my-game/useMyGame';

export default function MyGameScreen() {
  const { state } = useApp();
  const game = useMyGame(state.players);
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {game.phase === 'intro'   && <IntroPhase onStart={game.start} />}
      {game.phase === 'playing' && <PlayingPhase game={game} />}
      {game.phase === 'result'  && <ResultPhase game={game} onReset={game.reset} />}
    </View>
  );
}
```

### Step 6 — Wire the route in `app/(tabs)/home.tsx`

Add a case to `handleGamePress`:

```ts
function handleGamePress(game: Game) {
  if (game.id === 'spin_bottle') return router.push('/game/spin-bottle');
  if (game.id === 'my_game')    return router.push('/game/my-game');
  router.push(`/game/${game.id}`);
}
```

Once wired, the catch-all `[id].tsx` is bypassed and the real game screen loads.

---

### Checklist summary

- [ ] Add entry to `GAMES` in `data/games.ts`
- [ ] Add icon case to `GameIcon.tsx`
- [ ] Create `features/my-game/useMyGame.ts`
- [ ] Create `features/my-game/` UI components as needed
- [ ] Create `app/game/my-game.tsx` screen
- [ ] Add route case in `home.tsx` `handleGamePress`
