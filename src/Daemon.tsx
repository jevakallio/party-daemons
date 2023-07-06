import classnames from "classnames";

export function Daemon({
  id,
  name,
  color,
  active,
}: {
  id: string;
  name: string;
  color: string;
  active?: boolean;
}) {
  return (
    <li
      className="flex items-center space-x-3 font-bold group"
      style={{ color }}
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
    </li>
  );
}
