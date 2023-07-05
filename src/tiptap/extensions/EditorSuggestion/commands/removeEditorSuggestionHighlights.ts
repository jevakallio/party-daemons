import { EditorState } from "prosemirror-state";

export type RemoveEditorSuggestionHighlightsCommandArgs = {
  suggestionId: string;
};

/**
 * Removes all highlights related to a specific suggestion permanently.
 *
 * @NOTE: Does not remove the EditorSuggestion node itself.
 */
export function removeEditorSuggestionHighlights({
  suggestionId,
}: RemoveEditorSuggestionHighlightsCommandArgs): any {
  return ({ state }: { state: EditorState }) => {
    let tr = state.tr;
    let found = false;

    // remove all editor highlights that share
    // suggestion id with this suggestion
    state.doc.descendants((node, position) => {
      for (const mark of node.marks) {
        if (mark.type.name === "editorHighlight") {
          if (mark.attrs.suggestionId === suggestionId) {
            found = true;
            tr = tr.removeMark(
              position,
              position + node.nodeSize,
              state.schema.marks.editorHighlight
            );
            break;
          }
        }
      }
    });

    if (found) {
      state.apply(tr);
    }

    return true;
  };
}
