import {
  RoomProvider,
  useMutation,
  useStorage,
  useUpdateMyPresence,
} from "@/components/room-provider";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { LiveObject } from "@liveblocks/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";

const Editor: React.FC = ({}) => {
  const content = useStorage((root) => root.note.content);

  const updateMyPresence = useUpdateMyPresence();

  const updateNote = useMutation(({ storage }, noteType, newNote) => {
    const mutableNote = storage.get("note");
    mutableNote.set(noteType, newNote);
  }, []);

  if (content === null) {
    return (
      <div className="flex h-5/6 w-3/4 max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
        <Spinner />
      </div>
    );
  }

  return (
    <textarea
      value={content}
      className="flex h-5/6 w-3/4 max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none"
      onClick={(e) => {
        const cursorPosition = e.currentTarget.selectionStart;
        updateMyPresence({
          cursor: { position: cursorPosition },
        });
      }}
      onKeyDown={(e) => {
        const key = e.key;
        const cursorPosition = e.currentTarget.selectionStart;
        if (key === "Enter") {
          updateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowUp") {
          updateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowDown") {
          updateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowLeft") {
          updateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowRight") {
          updateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else {
          updateMyPresence({
            cursor: { position: cursorPosition },
          });
        }
      }}
      onChange={(e) => {
        const cursorPosition = e.currentTarget.selectionStart;
        updateMyPresence({
          cursor: { position: cursorPosition },
        });
        updateNote("content", e.target.value);
      }}
    />
  );
};

const Note: NextPage = () => {
  const router = useRouter();

  const { noteId } = router.query as { noteId: string | undefined };

  const { data: note, isLoading: isNoteLoading } = api.notes.getById.useQuery(
    {
      id: noteId as string,
    },
    {
      enabled: !!noteId,
    }
  );

  if (!note && !isNoteLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
          No note
        </div>
      </main>
    );
  }

  if (isNoteLoading) {
    return <main className="flex min-h-screen items-center bg-white"></main>;
  }

  return (
    <RoomProvider
      id={note.id}
      initialPresence={{ cursor: null }}
      initialStorage={{
        note: new LiveObject({
          content: note.content,
        }),
      }}
    >
      <main className="flex h-screen flex-col items-center justify-center bg-white">
        <div className="flex h-full w-full items-center justify-center">
          <Editor />
        </div>
      </main>
    </RoomProvider>
  );
};

export default Note;
