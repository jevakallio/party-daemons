import { ReactNodeViewRenderer } from "@tiptap/react";
import { EditorSuggestionSchema } from "./EditorSuggestionSchema";
import { EditorSuggestionView } from "./EditorSuggestionView";
import {
  insertEditorSuggestions,
  InsertEditorSuggestionsCommandArgs,
} from "./commands/insertEditorSuggestions";
import {
  removeEditorSuggestionHighlights,
  RemoveEditorSuggestionHighlightsCommandArgs,
} from "./commands/removeEditorSuggestionHighlights";
import {
  toggleEditorSuggestionHighlight,
  ToggleEditorSuggestionHighlightCommandArgs,
} from "./commands/toggleEditorSuggestionHighlight";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    editorSuggestion: {
      /**
       * Insert editor suggestions in the document
       */
      insertEditorSuggestions: (
        args: InsertEditorSuggestionsCommandArgs
      ) => ReturnType;

      /**
       * Remove editor suggestion highlights from the document
       * by suggestion id, including all highlights that have been split from it
       */
      removeEditorSuggestionHighlights: (
        args: RemoveEditorSuggestionHighlightsCommandArgs
      ) => ReturnType;

      /**
       * Toggle editor suggestion visibility in the document by suggestion id.
       * Note that all suggestions are visible in suggestions mode,
       * and this method is only useful when forcibly displaying suggestions
       * in other modes
       */
      toggleEditorSuggestionHighlight: (
        args: ToggleEditorSuggestionHighlightCommandArgs
      ) => ReturnType;
    };
  }
}

export const EditorSuggestionExtension = EditorSuggestionSchema.extend({
  addCommands() {
    return {
      // HERE BE DRAGONS,
      // Cmd+Click to find out if you're brave
      insertEditorSuggestions,
      removeEditorSuggestionHighlights,
      toggleEditorSuggestionHighlight,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(EditorSuggestionView);
  },
});
