import { Daemon } from "./Daemon";
import { Daemon as TDaemon } from "./party/daemons";
import { getDaemons, getName, getColor } from "./party/daemons";

const daemons = getDaemons();

export function Daemons({ activeDaemon }: { activeDaemon: TDaemon | null }) {
  return (
    <ul className="flex flex-col space-y-2 w-full">
      {daemons.map((id) => (
        <Daemon
          key={id}
          id={id}
          name={getName(id)}
          color={getColor(id)}
          active={id === activeDaemon}
        />
      ))}
    </ul>
  );
}
