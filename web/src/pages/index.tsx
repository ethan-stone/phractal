import Modal from "@/components/modal";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { debounce } from "@/utils/debounce";
import { useAuth, UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  type RefCallback,
} from "react";

const Editor: React.FC<{ noteId: string }> = ({ noteId }) => {
  const [text, setText] = useState("");

  const { mutate: updateNote } = api.notes.updateById.useMutation();

  const debouncedUpdateNote = useMemo(
    () => debounce(updateNote, 500),
    [updateNote]
  );

  return (
    <textarea
      value={text}
      className="flex h-full max-w-xl flex-grow resize-none rounded border border-neutral-900 bg-neutral-200 p-8 font-mono text-neutral-900 shadow-2xl focus:outline-none"
      onChange={(e) => {
        setText(e.target.value);
        debouncedUpdateNote({
          id: noteId,
          content: e.target.value,
        });
      }}
    />
  );
};

const Home: NextPage = () => {
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

  const lastNoteElementRef = useCallback<RefCallback<HTMLDivElement>>(
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
              <Editor noteId={selectedNote} />
            ) : (
              <div>No note</div>
            );
          }}
        />
        <div className="container flex flex-grow flex-col items-center justify-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <div>
              <AuthShowcase />
              <button
                className="rounded border border-neutral-900 p-2"
                onClick={() => newNote()}
              >
                New Note
              </button>
            </div>
          )}
          <div>
            {!data ? (
              <p>No Notes</p>
            ) : (
              data.pages
                .map(({ items }) => items)
                .flat()
                .map((note, idx, arr) => {
                  if (arr.length === idx + 1) {
                    return (
                      <div
                        key={note.id}
                        ref={lastNoteElementRef}
                        className="p-4 text-center"
                      >
                        {note.id}
                      </div>
                    );
                  }
                  return (
                    <div key={note.id} className="p-4 text-center">
                      {note.id}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();

  const { data: secretMessage } = api.secretMessage.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-center text-2xl text-white">
            {secretMessage && (
              <span>
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl text-white">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
