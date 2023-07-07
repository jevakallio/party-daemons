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
  const setFocusedDaemon = useActiveDaemon((s) => s.setFocusedDaemon);
  return (
    <li className="" style={{ color }}>
      <button
        className="flex items-center space-x-3 font-bold group"
        onClick={() => setFocusedDaemon(id)}
      >
        <div
          className={classnames({
            "rounded-full": true,
            "w-2.5 h-2.5 mx-1 animate-ping": active,
            "w-4 h-4": !active,
          })}
          style={{ backgroundColor: color }}
        ></div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          {name}
        </span>
      </button>
    </li>
  );
}
