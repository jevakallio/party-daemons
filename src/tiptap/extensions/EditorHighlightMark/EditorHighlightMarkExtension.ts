import { EditorHighlightMarkSchema } from "./EditorHighlightMarkSchema";

export interface EditorHighlightOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    highlight: {
      /**
       * Set a highlight mark
       */
      setEditorHighlight: (attributes?: { color: string }) => ReturnType;
      /**
       * Toggle a highlight mark
       */
      toggleEditorHighlight: (attributes?: { color: string }) => ReturnType;
      /**
       * Unset a highlight mark
       */
      unsetEditorHighlight: () => ReturnType;
    };
  }
}

/**
 * This special mark allows us to decorate segments of the manuscript
 * with elements that carry metadata about which suggestions they are
 * related to.
 *
 * The marks have no inline styling, you can use the following style
 * rules to display them:
 *
    mark[data-editorHighlight] {
      background-color: transparent;
    }

    mark[data-editorHighlight][data-visible] {
      background-color: #fecaca;
    }
 *
 */
export const EditorHighlightMarkExtension = EditorHighlightMarkSchema.extend({
  addCommands() {
    return {
      setEditorHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark("editorHighlight", attributes);
        },
      toggleEditorHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark("editorHighlight", attributes);
        },
      unsetEditorHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark("editorHighlight");
        },
    };
  },
});
