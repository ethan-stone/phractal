import Modal from "@/components/modal";
import {
  RoomProvider,
  useMutation,
  useStorage,
  useUpdateMyPresence,
} from "@/components/room-provider";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { type RefCallback, useCallback, useRef, useState } from "react";
import { LiveObject } from "@liveblocks/client";

const Editor: React.FC = ({}) => {
  const content = useStorage((root) => root.note.content);

  const updateMyPresence = useUpdateMyPresence();

  const updateNote = useMutation(({ storage }, noteType, newNote) => {
    const mutableNote = storage.get("note");
    mutableNote.set(noteType, newNote);
  }, []);

  if (content === null) {
    return (
      <div className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
        <Spinner />
      </div>
    );
  }

  return (
    <textarea
      value={content}
      className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none"
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

const Note: React.FC<{ noteId: string }> = ({ noteId }) => {
  const { data: note, isLoading: isNoteLoading } = api.notes.getById.useQuery({
    id: noteId,
  });

  if (!note && !isNoteLoading) {
    return (
      <div className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
        No note
      </div>
    );
  }

  if (isNoteLoading) {
    return (
      <div className="flex h-20 w-20 resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
        <Spinner />
      </div>
    );
  }

  return (
    <RoomProvider
      id={noteId}
      initialPresence={{ cursor: null }}
      initialStorage={{
        note: new LiveObject({
          content: note.content,
        }),
      }}
    >
      <Editor />
    </RoomProvider>
  );
};

const Notes: NextPage = () => {
  const { isSignedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string>();

  const {
    data,
    isLoading: isNotesLoading,
    hasNextPage,
    fetchNextPage,
  } = api.notes.listNotes.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      enabled: !!isSignedIn,
      getNextPageParam: (lastPage) => {
        const lastItem = lastPage.items[lastPage.items.length - 1];
        return lastPage.hasMore && lastItem?.id;
      },
    }
  );

  const { mutate: newNote, isLoading } = api.notes.newNote.useMutation({
    onSuccess(data) {
      setSelectedNote(data.id);
      setShowModal(true);
    },
  });

  const observer = useRef<IntersectionObserver | null>(null);

  const lastNoteElementRef = useCallback<RefCallback<HTMLButtonElement>>(
    (node) => {
      if (isNotesLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          void fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isNotesLoading]
  );

  return (
    <>
      <Head>
        <title>Phractal</title>
        <meta
          name="description"
          content="Simple, atomic, connected notetaking"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-200">
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          renderContent={({}) => {
            return selectedNote ? (
              // TODO: move this inside the editor component

              <Note noteId={selectedNote} />
            ) : (
              <div>No notes</div>
            );
          }}
        />
        <div className="container flex flex-grow flex-col items-center justify-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <button
              className="rounded border border-neutral-900 p-2"
              onClick={() => newNote()}
            >
              New Note
            </button>
          )}
          <div className="mt-4 flex flex-col gap-4">
            {!data ? (
              <p>No Notes</p>
            ) : (
              data.pages
                .map(({ items }) => items)
                .flat()
                .map((note, idx, arr) => {
                  const className =
                    "rounded border border-neutral-900 p-4 text-center focus:outline-none";

                  if (arr.length === idx + 1) {
                    return (
                      <button
                        key={note.id}
                        ref={lastNoteElementRef}
                        className={className}
                        onClick={() => {
                          setSelectedNote(note.id);
                          setShowModal(true);
                        }}
                      >
                        {note.id}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={note.id}
                      className={className}
                      onClick={() => {
                        setSelectedNote(note.id);
                        setShowModal(true);
                      }}
                    >
                      {note.id}
                    </button>
                  );
                })
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Notes;
