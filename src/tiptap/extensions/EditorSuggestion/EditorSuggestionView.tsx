import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

type Props = NodeViewProps;

export function EditorSuggestionView({ node, deleteNode, editor }: Props) {
  const { id, type, comment } = node.attrs as {
    id: string;
    type: string;
    comment: string;
  };

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

  return <NodeViewWrapper as="span" contentEditable={false}></NodeViewWrapper>;
}
