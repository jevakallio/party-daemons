import { PartyKitServer } from "partykit/server";
import { onConnect } from "y-partykit";

import {
  createEditorState,
  createEditorSyncState,
} from "../tiptap/createEditorSyncState";
import { insertEditorSuggestions } from "../tiptap/extensions/EditorSuggestion/commands/insertEditorSuggestions";
import { PartyGetter, shimRooms } from "./rooms";

export default {
  onConnect(ws, room) {
    // @ts-expect-error multiparty not available in production yet
    room.parties = shimRooms();

    return onConnect(ws, room, {
      callback: {
        async handler(ydoc) {
          try {
            // get the current text of the editor
            const text = createEditorState(ydoc).doc.textContent;

            // fan out requests to all daemons
            const results = await Promise.all([
              invoke(room.parties.nitpicker, room.id, text),
              invoke(room.parties.superfan, room.id, text),
              invoke(room.parties.someguy, room.id, text),
            ]);

            // return the result for the first daemon that responded with something
            const result = results.find((r) => r);

            if (result) {
              // insert the comment into the text editor
              const insert = insertEditorSuggestions({
                suggestions: [result],
                onSuggestionAlreadyExists,
                onSuggestionNotMatched,
              });

              // sync the transactions to the y.js document
              insert({ state: createEditorSyncState(ydoc) });
            }
          } catch (e) {
            console.error("Failed to do the thing", e);
          }
        },
        debounceWait: 2000,
        debounceMaxWait: 20_000,
      },
      persist: false,
    });
  },
} satisfies PartyKitServer;

async function invoke(party: PartyGetter, id: string, text: string) {
  // get instance of the room
  const worker = party.get(id);

  const request = new Request("party", {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // make a request to it and return the result
  const invocation: Response = await worker.fetch(request);
  const response = await invocation.json();

  return response.result;
}

function onSuggestionAlreadyExists(suggestion: any) {
  return console.log("already exists", suggestion);
}
function onSuggestionNotMatched(suggestion: any) {
  return console.log("did not match", suggestion);
}
