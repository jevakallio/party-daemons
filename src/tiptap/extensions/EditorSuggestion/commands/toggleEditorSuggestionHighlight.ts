import { EditorState } from "prosemirror-state";

export type ToggleEditorSuggestionHighlightCommandArgs = {
  suggestionId: string;
  visible: boolean;
};

/**
 * Sets EditorHighlight node visibility
 */
export function toggleEditorSuggestionHighlight({
  suggestionId,
  visible,
}: ToggleEditorSuggestionHighlightCommandArgs): any {
  return ({ state }: { state: EditorState }) => {
    let tr = state.tr;
    const found = false;

    state.doc.descendants((node, position) => {
      for (const mark of node.marks) {
        if (mark.type.name === "editorHighlight") {
          const attrs = mark.attrs;
          if (attrs.suggestionId === suggestionId) {
            tr = tr
              .removeMark(
                position,
                position + node.nodeSize,
                state.schema.marks.editorHighlight
              )
              .addMark(
                position,
                position + node.nodeSize,
                state.schema.marks.editorHighlight.create({
                  ...attrs,
                  visible,
                })
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
