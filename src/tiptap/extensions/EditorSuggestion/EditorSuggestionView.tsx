import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useActiveDaemon } from "../../../store";
import { useEffect } from "react";
import { Daemon } from "../../../party/daemons";

type Props = NodeViewProps;

export function EditorSuggestionView({ node, deleteNode, editor }: Props) {
  const { id, type, comment } = node.attrs as {
    id: string;
    type: Daemon;
    comment: string;
  };

  // TODO: ugh
  const setActiveDaemon = useActiveDaemon((s) => s.setActiveDaemon);
  useEffect(() => {
    if (type) {
      setActiveDaemon(type);
    }
  }, [type, setActiveDaemon]);

  const deleteHighlights = (suggestionId: string) => {
    editor.commands.removeEditorSuggestionHighlights({ suggestionId });
  };

  const onOpenPopup = () => {
    editor.commands.toggleEditorSuggestionHighlight({
      suggestionId: id,
      visible: true,
    });
  };

  const onClosePopup = () => {
    editor.commands.toggleEditorSuggestionHighlight({
      suggestionId: id,
      visible: false,
    });
  };

  const accept = async (suggestionId: string, feedback?: string) => {
    deleteHighlights(suggestionId);
    deleteNode();
  };

  const reject = async (suggestionId: string) => {
    deleteHighlights(suggestionId);
    deleteNode();
  };

  console.log("type", type);

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <div className="absolute inline-block left-0 -ml-72 w-64 bg-white p-4 rounded text-sm select-none">
        {comment}
      </div>
    </NodeViewWrapper>
  );
}
