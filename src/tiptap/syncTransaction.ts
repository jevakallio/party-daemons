import { Doc } from "yjs";
import { EditorState, Transaction } from "@tiptap/pm/state";

import { createEditorSyncState } from "./createEditorSyncState";

/**
 * A hacky way of applying a transaction to a prosemirror document and
 * syncing the changes to the provided Y.js document. This is a workaround
 * to y-prosemirror requiring access to prosemirror-view, which requires DOM.
 *
 * There is most likely a better way of doing this
 */
export function syncTransaction(
  ydoc: Doc,
  transact: (state: EditorState) => Transaction | undefined
) {
  try {
    // create an editor state instance for us to modify
    const state = createEditorSyncState(ydoc);

    // pass the editor state to the caller to modify
    const tr = transact(state);

    // if caller returned a transaction, apply it to the state,
    // which will be then synced into the Y.Doc
    if (tr) {
      state.apply(tr);
    }
  } catch (e) {
    console.error("Failed to update editor state", e);
    throw e;
  }
}
