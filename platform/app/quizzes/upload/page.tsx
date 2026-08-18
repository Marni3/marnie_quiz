import { auth } from "@/lib/auth";
import { getUserFolders } from "@/lib/folders";
import { Navbar } from "@/components/navbar";
import { UploadForm } from "./upload-form";

export default async function UploadPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const folders = await getUserFolders(userId);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar breadcrumb="Upload CSV" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UploadForm folders={folders} />
      </main>
    </div>
  );
}
