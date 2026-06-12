// ── Shared types for the Secret Number game ──

/** Which screen the game is currently on. Drives the switch in the main screen. */
export type SecretNumberPhase =
  | 'rules'
  | 'category'
  | 'distribution'
  | 'sorting'
  | 'results';

/** A player paired with their assigned secret number (1–100). */
export type PlayerAssignment = {
  name: string;
  number: number;
};

/** Index into the CATEGORIES array (e.g. "Food", "Animals", "Movies"). */
export type CategoryId = string;
