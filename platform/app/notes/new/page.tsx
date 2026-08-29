import { Metadata } from "next";
import { NoteEditor } from "../note-editor";

export const metadata: Metadata = {
  title: "Create Study Note | Marnie Quiz",
  description: "Create a new formula card, board exam mnemonic, or personal study note.",
};

export default function NewNotePage() {
  return <NoteEditor />;
}
