import { Mark, mergeAttributes } from "@tiptap/core";
import { createHtmlDataAttribute } from "../../createHtmlDataAttribute";

export interface EditorHighlightOptions {
  HTMLAttributes: Record<string, any>;
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
export const EditorHighlightMarkSchema = Mark.create<EditorHighlightOptions>({
  name: "editorHighlight",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      suggestionId: createHtmlDataAttribute("suggestionId"),

      type: createHtmlDataAttribute("type"),

      // whether highlight is forcibly visible
      // (all highlights are visible in suggestions mode)
      visible: createHtmlDataAttribute(
        "visible",
        false,
        (val) => val === "true"
      ),
    };
  },

  parseHTML() {
    return [
      {
        tag: "mark",
        attrs: {
          "data-editorHighlight": true,
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes(
        { "data-editorHighlight": "true" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },
});
