import { Doc } from "yjs";
import { getSchemaExtensions } from "./extensions";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { EditorState, Plugin } from "@tiptap/pm/state";
import { Node } from "@tiptap/pm/model";

import { getSchema } from "@tiptap/core";

// TODO: `exports` fields manually edited in y-prosemirror package.json
import { updateYFragment } from "y-prosemirror/plugins/sync-plugin";

const transformer = TiptapTransformer.extensions(getSchemaExtensions());

/**
 * A hacky way of applying a transaction to a prosemirror document and
 * syncing the changes to the provided Y.js document. This is a workaround
 * to y-prosemirror requiring access to prosemirror-view, which requires DOM.
 *
 * There is most likely a better way of doing this
 */
export function createEditorSyncState(ydoc: Doc) {
  try {
    // construct a prosemirror schema using our tiptap extensions
    const schema = getSchema(transformer.defaultExtensions);

    // construct a prosemirror document from current y.js state
    const rootFragmentField = "default";
    const fragment = ydoc.getXmlFragment(rootFragmentField);
    const json = transformer.fromYdoc(ydoc, rootFragmentField);
    const pmdoc = Node.fromJSON(schema, json);

    // on every prosemirror transaction, update the Y.js document
    const syncChanges = new Plugin({
      appendTransaction(_tr, _oldState, newState) {
        ydoc.transact(() => {
          try {
            updateYFragment(ydoc, fragment, newState.doc, new Map());
          } catch (e) {
            console.error("Failed to update y fragment", e);
            throw e;
          }
        });
        return undefined;
      },
    });

    // create an editor state instance
    const state = EditorState.create({
      doc: pmdoc,
      schema,
      plugins: [syncChanges],
    });

    return state;
  } catch (e) {
    console.error("Failed to update editor state", e);
    throw e;
  }
}
