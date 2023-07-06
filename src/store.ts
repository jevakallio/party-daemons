import type { Daemon } from "./party/daemons";

import { create } from "zustand";

type ActiveDaemonStore = {
  activeDaemon: Daemon | null;
  setActiveDaemon: (d: Daemon) => void;
  clearActiveDaemon: () => void;
};

export const useActiveDaemon = create<ActiveDaemonStore>((set) => ({
  activeDaemon: null,
  setActiveDaemon: (d: Daemon) => set({ activeDaemon: d }),
  clearActiveDaemon: () => set({ activeDaemon: null }),
}));
