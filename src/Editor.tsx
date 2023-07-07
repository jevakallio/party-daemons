import "./Editor.scss";

import { EditorContent, useEditor } from "@tiptap/react";
import { getInteractiveExtensions } from "./tiptap/extensions";
import { Doc } from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

const ydoc = new Doc();
const extensions = getInteractiveExtensions();

// TODO: Read room id from url
// TOOD: Read room url from env
const provider = new YPartyKitProvider(
  import.meta.env.VITE_PARTYKIT_HOST,
  "my-room",
  ydoc
);

export const Editor = () => {
  const editor = useEditor({
    extensions: [
      // document schema extensions
      ...extensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        // TODO: Read user from url/session
        user: {
          name: "Anonymous",
          color: "#f783ac",
        },
      }),
    ],
  });

  return (
    <div className="main-editor">
      <EditorContent editor={editor} />
    </div>
  );
};
