// src/hooks/useDraggablePanelStore.ts
import { create } from 'zustand';

interface DraggablePanelState {
  isOpen: boolean;
  instrument: any | null;
  quote: any | null;
  openPanel: (instrument: any, quote: any) => void;
  closePanel: () => void;
}

export const useDraggablePanelStore = create<DraggablePanelState>((set) => ({
  isOpen: false,
  instrument: null,
  quote: null,
  openPanel: (instrument, quote) => set({ isOpen: true, instrument, quote }),
  closePanel: () => set({ isOpen: false, instrument: null, quote: null }),
}));