import { PartyKitServer } from "partykit/server";
import { onConnect } from "y-partykit";
import { Doc } from "yjs";
import {
  createEditorState,
  createEditorSyncState,
} from "../tiptap/createEditorSyncState";
import { insertEditorSuggestions } from "../tiptap/extensions/EditorSuggestion/commands/insertEditorSuggestions";

let _currentDoc: Doc | null = null;

type Party = {
  connect: () => WebSocket;
  fetch: () => Promise<Response>;
};

async function invokeDaemon(party: Party, text: string) {
  const invocation: Response = await party.fetch(
    // @ts-expect-error TODO: Fix fetch type signature
    new Request("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
  );

  const response = await invocation.json();
  return response.result;
}

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
            // get the current text of the editor
            const stateBefore = createEditorState(ydoc);
            const text = stateBefore.doc.textContent;

            console.log("text is", text);

            // // invoke all daemon
            // const results = await Promise.all(
            //   Object.entries(room.parties).map(
            //     ([key, party]: [string, any]) => {
            //       return invokeDaemon(party.get(`${key}-1`), text);
            //     }
            //   )
            // );

            const results = await Promise.all([
              invokeDaemon(room.parties.nitpicker.get("nitpicker-1"), text),
              invokeDaemon(room.parties.superfan.get("superfan-1"), text),
            ]);

            console.log("results are", results);

            // return the result for the first daemon that responded with something
            const result = results.find((r) => r);

            console.log("result picked", result);

            if (result) {
              // insert the comment into the text editor
              const state = createEditorSyncState(ydoc);
              const insert = insertEditorSuggestions({
                suggestions: [result],
                onSuggestionAlreadyExists: (suggestion) =>
                  console.log("already exists", suggestion),
                onSuggestionNotMatched: (suggestion) =>
                  console.log("did not match", suggestion),
              });

              const success = insert({ state });
              console.log("success?", success);
            } else {
              console.log("no result");
            }
          } catch (e) {
            console.error("Failed to do the thing", e);
          }
        },
      },
    });
  },
} satisfies PartyKitServer;
