# PASS — Feature Ideas & Improvements

Everything here works **fully offline** and serves the core goal: get people talking, laughing, and knowing each other better through one shared phone.

Legend: 🟢 easy · 🟡 medium · 🔴 big effort

---

## 1. Build Out the 10 Stub Games

These are already registered in `data/games.ts` — they just need gameplay (see DOCS.md §9 for the how-to).

| Game | Mechanic sketch | Effort |
|---|---|---|
| **Truth or Dare** | Reuse the spin-bottle prompt pools but player-picked order instead of bottle. Add a "spice level" selector. | 🟢 |
| **Never Have I Ever** | Show a statement; everyone holds up fingers IRL, tap to log who's "guilty." Track the most innocent / most wild player for the end screen. | 🟢 |
| **Most Likely To** | Show "Who's most likely to…?" — everyone points at someone on 3-2-1, then tap the chosen player. Tally votes across rounds. | 🟢 |
| **Would You Rather** | Two stickers, A or B. Each player taps their pick, then reveal the group split (e.g. "4 chose A, 2 chose B"). Great conversation starter. | 🟢 |
| **Word Chain** | Player says a word starting with the last letter of the previous word. App runs a countdown timer per turn; lose = pass the phone. | 🟢 |
| **Charades** | Phone held to forehead. Word on screen, tilt down = correct, tilt up = skip (uses accelerometer — `expo-sensors`, still offline). Timer per round. | 🟡 |
| **Guess the Word** | One player sees the word, describes it without saying it; team guesses before the timer ends. Forbidden-words list for difficulty. | 🟡 |
| **Name That Movie** | Act out or describe a movie from emoji clues / one-line plot descriptions. Local dataset of ~200 movies. | 🟡 |
| **Who's the Imposter** | Everyone secretly sees the same word except one player who sees "IMPOSTER". Pass the phone around, then discuss and vote. The reveal flow is the fun part. | 🟡 |
| **Doodle Duel** | Drawing canvas (`react-native-svg` paths from touch events), other players guess. Pass-the-phone Pictionary. | 🔴 |

---

## 2. Get-to-Know-People Features

The social core — these turn quick games into real conversations.

- 🟢 **Question decks by depth** — tiered prompt packs: *Icebreaker* (new coworkers), *Friends*, *Deep* (childhood, dreams, regrets), *Spicy* (18+ only). Pick the deck before a game; same engine, different content.
- 🟢 **Hot Seat mode** — one player sits in the "seat" for 2 minutes; the app feeds the group rapid-fire questions about/for them. Rotates through the whole crew.
- 🟢 **Two Truths and a Lie** — app prompts each player to think of theirs, runs the voting, reveals the lie. Pure social, almost no logic needed.
- 🟡 **"How well do you know…?"** — the app asks Player A a question about Player B ("What would Theo pick: beach or mountains?"), B confirms or denies. Score pairs of friends.
- 🟡 **Superlatives night recap** — at session end, Bub awards titles based on tracked answers: "Most Honest," "Dare Devil," "Crowd Favorite." Shareable end-card.
- 🟡 **Pair shuffle** — games randomly pair people who haven't interacted yet this session (track who's been picked with whom) so nobody stays in their corner.
- 🔴 **Custom prompt builder** — players write their own truths/dares/questions before the session (inside jokes hit hardest). Stored locally in AsyncStorage, mixed into the pools.

---

## 3. Crew & Identity

- 🟢 **Player avatars** — photo or emoji per player chip (you've started this in onboarding — extend it to Home, Crew, SpinWheel, and the result screens so faces show up everywhere).
- 🟢 **Player colors** — let each player pick their accent color instead of auto-assigning.
- 🟡 **Session stats per player** — truths answered, dares done, times picked by the bottle, games won. Powers the superlatives recap.
- 🟡 **Saved crews** — "Friday squad," "Office team" — save and reload named groups instead of retyping.
- 🟡 **Streaks & badges** — local-only achievements: "Did 10 dares," "Survived 5 games," "Never rerolled."

---

## 4. Game-Session Features

- 🟢 **History screen (real)** — log each game played: who played, when, memorable picks. The tab already exists as a stub.
- 🟢 **Party mode / playlist** — queue 3–5 games; the app auto-advances between them so the night has a flow without anyone deciding.
- 🟡 **Round timers** — configurable countdown with a "time's up" haptic + Bub reaction. Reusable `<RoundTimer>` component for Charades, Word Chain, Guess the Word.
- 🟡 **Penalty wheel** — back out of a dare? Spin a penalty wheel (sing a song, talk in accent…). Adds stakes without anyone being the bad guy.
- 🟡 **Score system** — optional points across games in a session, leaderboard on the History tab.

---

## 5. Bub & Personality

- 🟢 **More Bub commentary** — pools of one-liners per situation (landed on the same person twice, someone rerolled 3 times, 18+ deck enabled). Random pick keeps him fresh.
- 🟢 **Bub reactions to outcomes** — `shocked`, `laughing`, `suspicious` poses for game moments (imposter revealed, dare refused).
- 🟡 **Sound effects + Bub voice blips** — `expo-av`, all bundled locally: spin whoosh, landing ding, drumroll on flip card. A mute toggle in settings.
- 🟡 **Bub idle easter eggs** — tap Bub 5 times and he gets dizzy; leave the home screen idle and he falls asleep.

---

## 6. UX & Technical Improvements

- 🟢 **Settings screen** — the gear button on Home goes nowhere yet. House: sound toggle, haptics toggle, 18+ content lock, reset onboarding, clear data.
- 🟢 **18+ filter enforcement** — a global "family mode" switch that hides `age: '18+'` games and spicy decks entirely (the data field already exists).
- 🟢 **Layout switcher** — `layout: 'grid'|'list'|'carousel'` is in the store but Home only renders grid. Wire up the other two.
- 🟢 **Empty/edge states** — what happens with 2 players in a 4+ game? Disable the card with a "needs 4 players" note instead of letting it start.
- 🟡 **Keep-awake during games** — `expo-keep-awake` so the screen doesn't sleep mid-round while the phone sits on the table.
- 🟡 **Landscape support for group screens** — SpinWheel and Charades read better with the phone flat/sideways on a table.
- 🟡 **Onboarding polish** — animate slide transitions (the swipe currently snaps), parallax Bub between steps.
- 🟡 **Haptics pass** — distinct haptic patterns per event: tick-tick-tick while the bottle slows, heavy thud on land, success buzz on dare completed.
- 🔴 **Localization** — prompts in a translatable format (per-language prompt files); the party-game market is very non-English friendly.

---

## 7. Content Systems (multiplies everything above)

- 🟡 **Prompt pack architecture** — restructure `data/prompts.ts` into packs: `{ id, name, deck: 'truth'|'dare'|'nhie'|'wyr', ageRating, prompts[] }`. Every question game then reads from the same system, and adding content = adding a file.
- 🟡 **No-repeat shuffle** — track used prompts per session so nothing repeats until a pool is exhausted (currently round-robin from index 0 every launch).
- 🔴 **Downloadable packs (still offline-first)** — fetch new packs when online, cache forever in AsyncStorage, play offline. The only network feature worth having.

---

## Suggested order

1. **Settings screen + 18+ lock** (unblocks family use, small)
2. **Most Likely To / Would You Rather / Never Have I Ever** (cheapest 3 games, all social, reuse Sticker + FlipCard)
3. **Prompt pack architecture** (do it before adding more content, not after)
4. **History + session stats + superlatives recap** (makes nights memorable, feeds retention)
5. **Charades with tilt controls** (the wow-factor game)
6. **Doodle Duel** (biggest build, save for last)
