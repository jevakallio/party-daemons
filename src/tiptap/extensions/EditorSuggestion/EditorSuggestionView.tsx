import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useActiveDaemon } from "../../../store";
import { useEffect } from "react";
import { Daemon } from "../../../party/daemons";

type Props = NodeViewProps;

export function EditorSuggestionView({ node }: Props) {
  const { type, comment } = node.attrs as {
    id: string;
    type: Daemon;
    comment: string;
  };

  // TODO: ugh
  const activeDaemon = useActiveDaemon((s) => s.activeDaemon);
  const setActiveDaemon = useActiveDaemon((s) => s.setActiveDaemon);
  const clearActiveDaemon = useActiveDaemon((s) => s.clearActiveDaemon);
  const focusedDaemon = useActiveDaemon((s) => s.focusedDaemon);

  useEffect(() => {
    if (type) {
      setActiveDaemon(type);
    }

    return () => {
      if (activeDaemon === type) {
        clearActiveDaemon();
      }
    };
  }, [type, activeDaemon, setActiveDaemon, clearActiveDaemon]);

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      {focusedDaemon === type ? (
        <div className="absolute inline-block left-0 -ml-72 w-64 bg-white p-4 rounded text-sm select-none">
          <div>{comment}</div>
        </div>
      ) : null}
    </NodeViewWrapper>
  );
}
