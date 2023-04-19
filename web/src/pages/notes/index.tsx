import Modal from "@/components/modal";
import {
  RoomProvider,
  useMutation,
  useUpdateMyPresence,
} from "@/components/room-provider";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { debounce } from "@/utils/debounce";
import { useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import {
  type RefCallback,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { LiveObject } from "@liveblocks/client";

const Editor: React.FC<{ noteId: string }> = ({ noteId }) => {
  const [text, setText] = useState("");

  const { data: note, isLoading: isNoteLoading } = api.notes.getById.useQuery(
    {
      id: noteId,
    },
    {
      onSuccess(data) {
        setText(data.content);
      },
    }
  );

  // const { mutate: updateNote } = api.notes.updateById.useMutation();

  // const debouncedUpdateNote = useMemo(
  //   () => debounce(updateNote, 500),
  //   [updateNote]
  // );

  const updateMyPresence = useUpdateMyPresence();

  const debouncedUpdateMyPresence = useMemo(
    () => debounce(updateMyPresence, 500),
    [updateMyPresence]
  );

  const updateNote = useMutation(({ storage }, noteType, newNote) => {
    const mutableNote = storage.get("note");
    mutableNote.set(noteType, newNote);
  }, []);

  const debouncedUpdateNote = useMemo(
    () => debounce(updateNote, 500),
    [updateNote]
  );

  if (!note && !isNoteLoading) {
    return (
      <div className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
        No note
      </div>
    );
  }

  if (isNoteLoading) {
    return (
      <div className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none">
        <Spinner />
      </div>
    );
  }

  return (
    <textarea
      value={text}
      className="flex h-full max-w-3xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none"
      onClick={(e) => {
        const cursorPosition = e.currentTarget.selectionStart;
        debouncedUpdateMyPresence({
          cursor: { position: cursorPosition },
        });
      }}
      onKeyDown={(e) => {
        const key = e.key;
        const cursorPosition = e.currentTarget.selectionStart;
        if (key === "Enter") {
          debouncedUpdateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowUp") {
          debouncedUpdateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowDown") {
          debouncedUpdateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowLeft") {
          debouncedUpdateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else if (key === "ArrowRight") {
          debouncedUpdateMyPresence({
            cursor: { position: cursorPosition },
          });
        } else {
          debouncedUpdateMyPresence({
            cursor: { position: cursorPosition },
          });
        }
      }}
      onChange={(e) => {
        const cursorPosition = e.currentTarget.selectionStart;
        debouncedUpdateMyPresence({
          cursor: { position: cursorPosition },
        });
        setText(e.target.value);
        debouncedUpdateNote("content", e.target.value);
      }}
    />
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
              <RoomProvider
                id={selectedNote}
                initialPresence={{ cursor: null }}
                initialStorage={{
                  note: new LiveObject({
                    content: "",
                  }),
                }}
              >
                <Editor noteId={selectedNote} />
              </RoomProvider>
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
