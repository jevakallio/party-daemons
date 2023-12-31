import { Doc } from "yjs";
import { getSchemaExtensions } from "./extensions";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { EditorState, Plugin } from "@tiptap/pm/state";
import { Node } from "@tiptap/pm/model";

import { getSchema } from "@tiptap/core";

// @ts-expect-error `exports` fields manually edited in y-prosemirror package.json
import { updateYFragment } from "y-prosemirror/plugins/sync-plugin";

const transformer = TiptapTransformer.extensions(getSchemaExtensions());

const rootFragmentField = "default";

/**
 * A hacky way of applying a transaction to a prosemirror document and
 * syncing the changes to the provided Y.js document. This is a workaround
 * to y-prosemirror requiring access to prosemirror-view, which requires DOM.
 *
 * There is most likely a better way of doing this
 */
export function createEditorState(ydoc: Doc, plugins?: Plugin[]) {
  try {
    // construct a prosemirror schema using our tiptap extensions
    const schema = getSchema(transformer.defaultExtensions);
    const json = transformer.fromYdoc(ydoc, rootFragmentField);
    const pmdoc = Node.fromJSON(schema, json);
    const state = EditorState.create({
      doc: pmdoc,
      schema,
      plugins,
    });

    return state;
  } catch (e) {
    console.error("Failed to initialize editor state", e);
    throw e;
  }
}

/**
 * A hacky way of applying a transaction to a prosemirror document and
 * syncing the changes to the provided Y.js document. This is a workaround
 * to y-prosemirror requiring access to prosemirror-view, which requires DOM.
 *
 * There is most likely a better way of doing this
 */
export function createEditorSyncState(ydoc: Doc) {
  try {
    // construct a prosemirror document from current y.js state
    const fragment = ydoc.getXmlFragment(rootFragmentField);

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

    return createEditorState(ydoc, [syncChanges]);
  } catch (e) {
    console.error("Failed to update editor state", e);
    throw e;
  }
}
