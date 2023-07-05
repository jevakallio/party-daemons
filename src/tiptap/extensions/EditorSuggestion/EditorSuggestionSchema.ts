import { Node, mergeAttributes } from "@tiptap/core";
import { createHtmlDataAttribute } from "../../createHtmlDataAttribute";

export const EditorSuggestionSchema = Node.create({
  name: "editorSuggestion",

  // https://tiptap.dev/api/schema#group
  group: "inline",

  // https://tiptap.dev/api/schema#inline
  inline: true,

  // https://tiptap.dev/api/schema#selectable
  selectable: false,

  // https://tiptap.dev/api/schema#content
  content: "inline*",

  // https://tiptap.dev/api/schema#atom
  atom: true,

  // // https://tiptap.dev/api/schema#isolating
  isolating: false,

  // https://tiptap.dev/api/schema#defining
  defining: true,

  parseHTML() {
    return [
      {
        tag: "editorSuggestion",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["editorSuggestion", mergeAttributes({}, HTMLAttributes), 0];
  },

  addAttributes() {
    return {
      // suggestion id
      id: createHtmlDataAttribute("id"),

      // suggestion type
      type: createHtmlDataAttribute("type"),

      // suggestion comment
      comment: createHtmlDataAttribute("comment"),

      // the original text of this range, before any user edits
      // (useful for tracking user changes of edits)
      originalText: createHtmlDataAttribute("originalText"),
    };
  },
});
