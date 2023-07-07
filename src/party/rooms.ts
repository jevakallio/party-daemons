import nitpicker from "./daemons/nitpicker";
import superfan from "./daemons/superfan";
import someguy from "./daemons/someguy";

const rooms = {
  nitpicker,
  superfan,
  someguy,
};

export type PartyGetter = {
  get(id: string): Party;
};

export type Party = {
  fetch: (request: Request) => Promise<Response>;
  connect?: () => WebSocket;
};

export const shimRooms = () => {
  const shim: Record<string, PartyGetter> = {};
  for (const [key, room] of Object.entries(rooms)) {
    shim[key] = {
      get(_id: string) {
        return {
          fetch(request: Request) {
            return room.onRequest(request);
          },
        };
      },
    };
  }

  return shim;
};
