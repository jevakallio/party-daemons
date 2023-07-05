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

          try {
            const matcher = "Dogs are cute";
            const daemon = room.parties.nitpicker.get("room-1");

            const response: Response = await daemon.fetch(
              // @ts-expect-error TODO: Fix fetch type signature
              new Request("", {
                method: "POST",
                body: matcher,
              })
            );
            const comment = await response.text();

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
                  comment,
                  matcher,
                  createdAt: new Date().toISOString(),
                },
              ],
            });

            const success = insert({ state });
            console.log("success?", success);
          } catch (e) {
            console.error("Failed to do the thing", e);
          }
        },
      },
    });
  },
} satisfies PartyKitServer;
