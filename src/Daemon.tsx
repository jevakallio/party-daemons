import classnames from "classnames";
import { useActiveDaemon } from "./store";
import { Daemon as TDaemon } from "./party/daemons";

export function Daemon({
  id,
  name,
  color,
  active,
}: {
  id: TDaemon;
  name: string;
  color: string;
  active?: boolean;
}) {
  const state = useActiveDaemon();
  return (
    <li className="w-full" style={{ color }}>
      <button
        className="flex items-center space-x-3 font-bold group w-full"
        onClick={() =>
          state.focusedDaemon === id
            ? state.clearFocusedDaemon()
            : state.setFocusedDaemon(id)
        }
      >
        <div
          className={classnames({
            "rounded-full": true,
            "w-2.5 h-2.5 mx-1 animate-ping": active,
            "w-4 h-4": !active,
          })}
          style={{ backgroundColor: color }}
        ></div>
        <span
          className={classnames({
            "group-hover:opacity-100 transition-opacity duration-300 cursor-pointer":
              true,
            "opacity-0": !active,
          })}
        >
          {name}
        </span>
      </button>
    </li>
  );
}
