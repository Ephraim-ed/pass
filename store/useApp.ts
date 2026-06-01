import { useEffect, useState } from 'react';
import { CategoryId } from '@/data/games';
import { loadItem, saveItem } from '@/utils/storage';

export type LayoutMode = 'grid' | 'list' | 'carousel';

export type AppState = {
  players: string[];
  category: CategoryId;
  layout: LayoutMode;
  hasOnboarded: boolean;
};

const STORAGE_KEY = 'pass_state';

const DEFAULT_STATE: AppState = {
  players: ['Mia', 'Noor', 'Theo', 'Sam', 'Jay'],
  category: 'all',
  layout: 'grid',
  hasOnboarded: false,
};

type Setter<T> = T | ((prev: T) => T);

export function useApp() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadItem<AppState>(STORAGE_KEY, DEFAULT_STATE).then((s) => {
      setState(s);
      setLoaded(true);
    });
  }, []);

  function update(patch: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) {
    setState((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      saveItem(STORAGE_KEY, next);
      return next;
    });
  }

  function addPlayer(name: string) {
    update((prev) => ({ players: [...prev.players, name] }));
  }

  function removePlayer(name: string) {
    update((prev) => ({ players: prev.players.filter((p) => p !== name) }));
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

  return { state, loaded, addPlayer, removePlayer, setCategory, setLayout, setOnboarded, update };
}
