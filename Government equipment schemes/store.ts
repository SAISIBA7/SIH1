'use client';

import { useSyncExternalStore } from 'react';
import { Scheme, SchemeCategory, FarmerProfile } from './types';
import { mockSchemes, mockFarmerProfile } from './data/schemes.mock';

export interface SchemeStoreState {
  schemes: Scheme[];
  farmerProfile: FarmerProfile;
  activeCategory: SchemeCategory;
  selectedSchemeId: string | null;
  isSimpleText: boolean;
  isVoicePlaying: boolean;
  audioText: string | null;
  setSchemes: (schemes: Scheme[]) => void;
  setFilter: (category: SchemeCategory) => void;
  setSelectedScheme: (id: string | null) => void;
  applyScheme: (id: string) => void;
  toggleDocumentReady: (schemeId: string, docId: string) => void;
  toggleSimpleText: () => void;
  setVoicePlaying: (playing: boolean, text?: string | null) => void;
}

let state: SchemeStoreState = {
  schemes: mockSchemes,
  farmerProfile: mockFarmerProfile,
  activeCategory: 'All',
  selectedSchemeId: null,
  isSimpleText: false,
  isVoicePlaying: false,
  audioText: null,

  setSchemes: (schemes) => updateState({ schemes }),
  setFilter: (category) => updateState({ activeCategory: category }),
  setSelectedScheme: (id) => updateState({ selectedSchemeId: id }),

  applyScheme: (id) =>
    updateState({
      schemes: state.schemes.map((s) =>
        s.id === id
          ? {
              ...s,
              applicationStatus: 'submitted',
              applicationStage: 'submitted',
              submittedDate: 'Today',
              estimatedDays: '7–10 working days',
            }
          : s
      ),
    }),

  toggleDocumentReady: (schemeId, docId) =>
    updateState({
      schemes: state.schemes.map((s) =>
        s.id === schemeId
          ? {
              ...s,
              documents: s.documents.map((d) =>
                d.id === docId
                  ? { ...d, status: d.status === 'ready' ? 'missing' : 'ready' }
                  : d
              ),
            }
          : s
      ),
    }),

  toggleSimpleText: () => updateState({ isSimpleText: !state.isSimpleText }),

  setVoicePlaying: (playing, text = null) =>
    updateState({ isVoicePlaying: playing, audioText: text }),
};

const listeners = new Set<() => void>();

function updateState(partial: Partial<SchemeStoreState>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function useSchemeStore(): SchemeStoreState;
export function useSchemeStore<T>(selector: (state: SchemeStoreState) => T): T;
export function useSchemeStore<T>(selector?: (state: SchemeStoreState) => T) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return selector ? selector(current) : current;
}
