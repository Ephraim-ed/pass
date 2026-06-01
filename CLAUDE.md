# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Expo SDK version

This project uses **Expo SDK 56** (React Native 0.85, React 19). Always consult the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing code involving Expo APIs. Package versions installed by `npx expo install` are authoritative — do not guess or use versions from memory.

## Commands

```bash
npx expo start           # Start dev server (opens Expo Go on device/simulator)
npx expo start --clear   # Start with cache cleared — required after babel/metro changes
npx expo run:ios         # Full native build for iOS simulator (needed for new native modules)
npx tsc --noEmit         # Type check without emitting
```

Use `npx expo install <package>` (not `npm install`) when adding native packages — it resolves the version compatible with the installed SDK.

## Architecture

**Routing** — expo-router v5 (file-based). `app/index.tsx` reads AsyncStorage and immediately redirects to either `/onboarding` or `/(tabs)/home`. The `(tabs)` group hides the native tab bar and renders a custom floating `TabBar` component instead.

**State** — `store/useApp.ts` exports a single `useApp()` hook backed by AsyncStorage (`pass_state` key). There is no global context provider — each screen calls `useApp()` directly. State loads asynchronously on first call; `loaded` signals when it's ready.

**Visual system** — Every interactive surface is a "sticker": chunky `2.5px ink border` + hard offset shadow (a solid ink `View` positioned behind, offset by `shadowY`) + a `expo-linear-gradient`. `Sticker` (static) and `StickerButton` (pressable with Reanimated press animation) are the two base primitives everything builds on. Color helpers `lighten()` / `darken()` in `theme/colors.ts` compute gradient stops at runtime.

**Reanimated** — Version 4.x (SDK 56). The babel plugin (`react-native-reanimated/plugin`) was removed in v4 — **do not add it back to `babel.config.js`**. Gesture handler callbacks (from `react-native-gesture-handler`) run as worklets on the UI thread; any JS call (setState, Haptics, etc.) inside them must be wrapped with `runOnJS`.

**Adding a new game**
1. Add an entry to `data/games.ts` (id, name, color, cat, age, tag, mins).
2. Add an icon case to `components/game-icons/GameIcon.tsx` (64×64 viewBox SVG, switch on `game.id`).
3. Create `app/game/<id>.tsx` with the screen. The home grid and routing wire up automatically via the `id` field.

**Bub mascot** — `components/mascot/Bub.tsx` accepts a `pose` prop (`idle | wave | point | mic | cheer | peek`). Animations are split across three `Animated.View` layers (body sway, animated arm, animated hat) stacked absolutely over a static SVG body, because `react-native-svg`'s `G` component doesn't accept a `style` prop for Reanimated animated styles.

**`metro.config.js`** — adds `buffer` to `extraNodeModules` to satisfy `react-native-svg`'s `fetchData.ts` import.
