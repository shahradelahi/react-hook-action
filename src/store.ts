import { create } from 'zustand';

interface ActionState {
  isLoading: boolean;
  error: unknown | undefined;
  result: unknown | undefined;
}

interface Store {
  actions: Record<string, ActionState>;
  getAction: (key: string) => ActionState;
  setAction: (key: string, action: ActionState) => void;
  setActionResult: (key: string, result: unknown) => void;
  setActionLoading: (key: string, isLoading: boolean) => void;
  reset: () => void;
  resetAction: (key: string) => void;
}

const DEFAULT_ACTION_STATE: ActionState = {
  isLoading: false,
  error: undefined,
  result: undefined,
};

export const ActionStore = create<Store>((set, get) => ({
  actions: {},

  getAction: (key) => {
    return get().actions[key] || DEFAULT_ACTION_STATE;
  },

  setAction: (key, action) => set((state) => ({ actions: { ...state.actions, [key]: action } })),

  setActionResult: (key, result) => {
    const action = get().getAction(key);
    set((state) => ({ actions: { ...state.actions, [key]: { ...action, result } } }));
  },

  setActionLoading: (key, isLoading) => {
    const action = get().getAction(key);
    set((state) => ({ actions: { ...state.actions, [key]: { ...action, isLoading } } }));
  },

  reset: () => set({ actions: {} }),

  resetAction: (key) =>
    set((state) => ({
      actions: {
        ...state.actions,
        [key]: { isLoading: false, error: undefined, result: undefined },
      },
    })),
}));
