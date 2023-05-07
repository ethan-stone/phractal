import NewNoteCard from "@/components/new-note-card";
import NoteCard from "@/components/note-card";
import { notesRepo } from "@/server/repos/notes-repo";
import { currentUser } from "@clerk/nextjs/app-beta";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const notes = await notesRepo.paginateByUserIdAndUpdatedAt({
    limit: 30,
    userId: user.id,
  });

  return (
    <main className="flex h-screen bg-white">
      <div className="flex flex-wrap gap-8 overflow-y-auto px-8 py-4">
        <NewNoteCard key={"123"} />
        {notes.items.map((note, idx) => {
          return <NoteCard key={idx} noteId={note.id} />;
        })}
      </div>
    </main>
  );
}
