import { Metadata } from "next";
import { NotesView } from "./notes-view";

export const metadata: Metadata = {
  title: "Personal Study Notebook & Vault | Marnie Quiz",
  description:
    "Your private study vault of formula cheat-sheets, text highlights, board exam mnemonics, and custom notes.",
};

export default function NotesPage() {
  return <NotesView />;
}
