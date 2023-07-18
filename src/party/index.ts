import { PartyKitRoom, PartyKitServer } from "partykit/server";
import { onConnect } from "y-partykit";

import {
  createEditorState,
  createEditorSyncState,
} from "../tiptap/createEditorSyncState";
import { insertEditorSuggestions } from "../tiptap/extensions/EditorSuggestion/commands/insertEditorSuggestions";

export default {
  onConnect(ws, room) {
    return onConnect(ws as unknown as WebSocket, room, {
      callback: {
        async handler(ydoc) {
          try {
            // get the current text of the editor
            const text = createEditorState(ydoc).doc.textContent;

            // fan out requests to all daemons
            const daemon = room.parties.daemon;
            const results = await Promise.all([
              invoke(daemon, "superfan", text),
              invoke(daemon, "nitpicker", text),
              invoke(daemon, "someguy", text),
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

async function invoke(
  party: PartyKitRoom["parties"]["daemon"],
  id: string,
  text: string
) {
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
  const invocation = await worker.fetch(request);
  const response = await invocation.json<{ result: any }>();

  return response.result;
}

function onSuggestionAlreadyExists(suggestion: any) {
  return console.log("already exists", suggestion);
}
function onSuggestionNotMatched(suggestion: any) {
  return console.log("did not match", suggestion);
}
