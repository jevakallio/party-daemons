import { Daemon } from "./Daemon";
import { getDaemons, getName, getColor } from "./party/daemons";
import { useActiveDaemon } from "./store";

const daemons = getDaemons();

export function Daemons() {
  const activeDaemon = useActiveDaemon((s) => s.activeDaemon);
  return (
    <div>
      <ul className="flex flex-col space-y-2">
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
    </div>
  );
}
