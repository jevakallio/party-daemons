const daemons = {
  nitpicker: "Nitpicker",
  superfan: "Superfan",
};

const colors = {
  nitpicker: "#f87171",
  superfan: "#38bdf8",
};

export type Daemon = keyof typeof daemons;

export const getDaemons = () => {
  return Object.keys(daemons) as Daemon[];
};

export const getName = (daemon: Daemon) => {
  return daemons[daemon];
};

export const getColor = (daemon: Daemon) => {
  return colors[daemon];
};
