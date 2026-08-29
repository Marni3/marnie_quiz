import { Navbar } from "@/components/navbar";
import { SettingsView } from "./settings-view";

export const metadata = {
  title: "Settings & Data Management | Marnie Quiz",
  description: "Manage your local study data, export Study Vault backups, configure AI providers, and reset progress.",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col">
      <Navbar breadcrumb="Settings" />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsView />
      </main>
    </div>
  );
}
