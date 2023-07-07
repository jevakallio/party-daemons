import type { Daemon } from "./party/daemons";

import { create } from "zustand";

type ActiveDaemonStore = {
  activeDaemon: Daemon | null;
  focusedDaemon: Daemon | null;
  setActiveDaemon: (d: Daemon) => void;
  clearActiveDaemon: () => void;
  setFocusedDaemon: (d: Daemon) => void;
  clearFocusedDaemon: () => void;
};

export const useActiveDaemon = create<ActiveDaemonStore>((set) => ({
  activeDaemon: null,
  setActiveDaemon: (d: Daemon) => set({ activeDaemon: d }),
  clearActiveDaemon: () => set({ activeDaemon: null }),

  focusedDaemon: null,
  setFocusedDaemon: (d: Daemon) => set({ focusedDaemon: d }),
  clearFocusedDaemon: () => set({ focusedDaemon: null }),
}));
