import StarterKit from "@tiptap/starter-kit";
import { EditorHighlightMarkSchema } from "./EditorHighlightMark/EditorHighlightMarkSchema";
import { EditorSuggestionSchema } from "./EditorSuggestion/EditorSuggestionSchema";
import { EditorHighlightMarkExtension } from "./EditorHighlightMark/EditorHighlightMarkExtension";
import { EditorSuggestionExtension } from "./EditorSuggestion/EditorSuggestionExtension";
import { Extension } from "@tiptap/core";

/** Shared extensions for client and server */
function getBaseExtensions(): Extension[] {
  return [
    StarterKit.configure({
      // The Collaboration extension comes with its own history handling
      history: false,
    }),
  ];
}

/** Extensions to be used on the server */
export function getSchemaExtensions() {
  return [
    ...getBaseExtensions(),
    EditorHighlightMarkSchema,
    EditorSuggestionSchema,
  ];
}

/** Extensions to be used on the client */
export function getInteractiveExtensions() {
  return [
    ...getBaseExtensions(),
    EditorHighlightMarkExtension,
    EditorSuggestionExtension,
  ];
}
