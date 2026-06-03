# PASS — Pass-the-Phone Party Games

A mobile party game app built with Expo / React Native. One phone, your whole crew, zero setup. Pick a game, hand the phone around, and let chaos run its course.

---

## Features

- **11 party games** — Truth or Dare, Spin the Bottle, Doodle Duel, Never Have I Ever, Charades, Would You Rather, and more
- **Crew management** — add players with optional avatar photos; photos show up in the spin wheel and crew card
- **Spin the Bottle** — fully playable with swipe-to-spin (faster swipe = faster bottle), animated player orbit, 3D flip cards for Truth/Dare prompts
- **Bub** — animated blob mascot that hosts the whole experience
- **Offline-first** — no accounts, no internet required
- **Sticker visual system** — chunky ink borders, hard offset shadows, gradient fills throughout

---

## Screens

| Screen | Description |
|---|---|
| Onboarding | 3-step swipeable intro → crew builder with avatar capture |
| Home | Game grid, crew card, featured pick, category filter |
| Crew | Manage players and their avatar photos |
| History | Coming soon |
| Spin the Bottle | Intro → swipe to spin → Truth/Dare flip card |
| Game stubs | "Coming soon" screens for the other 10 games |

---

## Stack

| Concern | Library |
|---|---|
| Framework | Expo SDK 56 (React Native 0.85, React 19) |
| Routing | expo-router v5 (file-based) |
| Animation | react-native-reanimated v4 |
| Gestures | react-native-gesture-handler |
| SVG | react-native-svg |
| Gradients | expo-linear-gradient |
| Haptics | expo-haptics |
| Camera / Photos | expo-image-picker |
| Storage | @react-native-async-storage/async-storage |
| Fonts | Bricolage Grotesque 800, Geist 600/700, Geist Mono 500 |

---

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start

# Start with cleared cache (required after babel/metro changes)
npx expo start --clear

# Full native iOS build (needed for camera/photo picker)
npx expo run:ios

# Type check
npx tsc --noEmit
```

Open with **Expo Go** on your device or the iOS Simulator.

> Camera and photo library access require a native build (`npx expo run:ios`). Expo Go won't prompt for permissions.

---

## Project structure

```
app/
  _layout.tsx           # Fonts, providers, safe area
  index.tsx             # Launch → onboarding or home
  onboarding.tsx        # 3 intro slides + crew builder
  (tabs)/
    home.tsx            # Game grid + crew card
    crew.tsx            # Player + avatar management
    history.tsx         # Placeholder
  game/
    spin-bottle.tsx     # Intro → spin → result
    [id].tsx            # "Coming soon" stub for other games
components/
  mascot/Bub.tsx        # Animated blob mascot (6 poses)
  ui/                   # Sticker, StickerButton, TabBar, Dots, SpeechBubble
  shared/               # PlayerChip, CategoryPills
  game-icons/GameIcon   # SVG pictogram per game
data/
  games.ts              # Game catalogue (id, name, color, cat, age, tag, mins)
  prompts.ts            # Truth / Dare prompt pools
features/
  spin-bottle/          # SpinWheel, FlipCard, useSpinGame
store/
  useApp.ts             # Module-level singleton store → AsyncStorage
theme/
  tokens.ts             # COLORS, FONTS, RADIUS
  colors.ts             # lighten() / darken() helpers
utils/
  pickAvatar.ts         # Camera / photo library picker with confirmation prompt
  storage.ts            # AsyncStorage load/save helpers
```

---

## Architecture notes

**State** — `useApp()` is a module-level singleton (not a Context provider). All tabs share one `_state` object; any `update()` call notifies every mounted subscriber and persists to AsyncStorage. Fields: `players`, `avatars`, `category`, `layout`, `hasOnboarded`.

**Visual system** — Every surface is a *sticker*: `2.5px` ink border + hard offset shadow (solid ink `View` behind, offset by `shadowY`) + `expo-linear-gradient`. `Sticker` (static) and `StickerButton` (Reanimated press animation + haptics) are the two base primitives.

**Bub mascot** — Animations are split across three `Animated.View` layers (body sway, animated arm, animated hat) stacked over a static SVG body, because `react-native-svg`'s `G` component doesn't accept Reanimated animated styles.

**Reanimated v4** — The Babel plugin was removed in v4; do not add it back to `babel.config.js`. Gesture handler callbacks that call JS (setState, Haptics) must be wrapped with `runOnJS`.

**Adding a new game**
1. Add an entry to `data/games.ts`
2. Add an icon case to `components/game-icons/GameIcon.tsx` (64×64 viewBox SVG)
3. Create `app/game/<id>.tsx` — routing wires up automatically

---

## License

MIT
