import { PartyKitServer } from "partykit/server";
import { onConnect } from "y-partykit";
import { Doc } from "yjs";
import { createEditorSyncState } from "../tiptap/createEditorSyncState";
import { insertEditorSuggestions } from "../tiptap/extensions/EditorSuggestion/commands/insertEditorSuggestions";

let _currentDoc: Doc | null = null;

export default {
  onConnect(ws, room) {
    return onConnect(ws, room, {
      persist: false,
      callback: {
        debounceWait: 2000,
        debounceMaxWait: 20_000,
        async handler(ydoc) {
          if (_currentDoc !== ydoc) {
            _currentDoc = ydoc;
          }

          const state = createEditorSyncState(ydoc);
          const insert = insertEditorSuggestions({
            onSuggestionAlreadyExists(suggestion) {
              console.log("onSuggestionAlreadyExists", suggestion);
            },
            onSuggestionNotMatched(suggestion) {
              console.log("onSuggestionNotMatched", suggestion);
            },
            suggestions: [
              {
                id: "foo",
                type: "discuss",
                comment: "What do you think about this?",
                matcher: "Dogs are cute",
                createdAt: new Date().toISOString(),
              },
            ],
          });

          const success = insert({ state });

          console.log("success?", success);
        },
      },
    });
  },
} satisfies PartyKitServer;
