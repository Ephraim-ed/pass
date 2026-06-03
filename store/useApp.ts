import { useEffect, useReducer } from 'react';
import { CategoryId } from '@/data/games';
import { loadItem, saveItem } from '@/utils/storage';

export type LayoutMode = 'grid' | 'list' | 'carousel';

export type AppState = {
  players: string[];
  avatars: Record<string, string>;
  category: CategoryId;
  layout: LayoutMode;
  hasOnboarded: boolean;
};

const STORAGE_KEY = 'pass_state';

const DEFAULT_STATE: AppState = {
  players: ['Mia', 'Noor', 'Theo', 'Sam', 'Jay'],
  avatars: {},
  category: 'all',
  layout: 'grid',
  hasOnboarded: false,
};

// ── Module-level singleton ─────────────────────────────────────
// All useApp() callers share one state object. Any update triggers
// a re-render in every mounted subscriber.

let _state: AppState = DEFAULT_STATE;
let _loaded = false;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

let _loadPromise: Promise<void> | null = null;
function ensureLoaded() {
  if (_loadPromise) return _loadPromise;
  _loadPromise = loadItem<AppState>(STORAGE_KEY, DEFAULT_STATE).then((saved) => {
    // Merge so that fields added after initial save (e.g. avatars) always exist
    _state = { ...DEFAULT_STATE, ...saved, avatars: saved.avatars ?? {} };
    _loaded = true;
    notify();
  });
  return _loadPromise;
}

function update(patch: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) {
  _state = {
    ..._state,
    ...(typeof patch === 'function' ? patch(_state) : patch),
  };
  saveItem(STORAGE_KEY, _state);
  notify();
}

// ── Hook ───────────────────────────────────────────────────────

export function useApp() {
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    _listeners.add(forceRender);
    ensureLoaded();
    return () => { _listeners.delete(forceRender); };
  }, []);

  function addPlayer(name: string) {
    update((prev) => ({ players: [...prev.players, name] }));
  }

  function removePlayer(name: string) {
    update((prev) => ({
      players: prev.players.filter((p) => p !== name),
      avatars: Object.fromEntries(Object.entries(prev.avatars).filter(([k]) => k !== name)),
    }));
  }

  function setAvatar(name: string, uri: string) {
    update((prev) => ({ avatars: { ...prev.avatars, [name]: uri } }));
  }

  function removeAvatar(name: string) {
    update((prev) => {
      const { [name]: _removed, ...rest } = prev.avatars;
      return { avatars: rest };
    });
  }

  function setCategory(category: CategoryId) {
    update({ category });
  }

  function setLayout(layout: LayoutMode) {
    update({ layout });
  }

  function setOnboarded() {
    update({ hasOnboarded: true });
  }

  return {
    state: _state,
    loaded: _loaded,
    addPlayer,
    removePlayer,
    setAvatar,
    removeAvatar,
    setCategory,
    setLayout,
    setOnboarded,
    update,
  };
}
