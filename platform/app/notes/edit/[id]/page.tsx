import { Metadata } from "next";
import { NoteEditor } from "../../note-editor";

export const metadata: Metadata = {
  title: "Edit Study Note | Marnie Quiz",
  description: "Edit your formula card, board exam mnemonic, or personal study note.",
};

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoteEditor noteId={id} />;
}
