import { Attribute } from "@tiptap/core";

/**
 * Creates a Tiptap Node/Mark attribute that's serialized/deserialized to
 * HTML data-* attributes
 *@attribute name - key index for html-parser
 *@attribute defaultValue - value that attached to node by first initilize
 *@attribute converter - custom convert value
 *@attribute prefix - custom prefix for handling text at HTML. By default - *data-*
 */
export const createHtmlDataAttribute = <T>(
  name: string,
  defaultValue?: T | null,
  converter?: (raw: string | null) => T,
  prefix = "data-"
): Partial<Attribute> => {
  return {
    default: defaultValue || null,
    parseHTML: (element) => {
      const value = element.getAttribute(`${prefix}${name}`);
      return converter ? converter(value) : value;
    },
    renderHTML: (attributes) => {
      if (!attributes[name]) {
        return {};
      }

      return {
        [`${prefix}${name}`]: attributes[name],
      };
    },
  };
};
