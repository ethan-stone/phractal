import { api } from "@/utils/api";
import { useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { type RefCallback, useCallback, useRef } from "react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/router";
import NoteCard from "@/components/note-card";

const NewNoteCard: React.FC = () => {
  const router = useRouter();

  const { mutate: newNote } = api.notes.newNote.useMutation({
    onSuccess(data) {
      void router.push(`/notes/${data.id}`);
    },
  });

  return (
    <button
      className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-gray-500 p-4 py-10 text-left shadow-xl"
      onClick={() => newNote()}
    >
      <h3 className="text-md text-gray-900">New Note</h3>
      <p className="mt-2 text-sm text-gray-500">Create a new note</p>
    </button>
  );
};

const Notes: NextPage = () => {
  const { isSignedIn } = useAuth();

  const {
    data: notes,
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
      <main className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="grid grid-cols-8 gap-8 p-8">
          <div key={"123"}>
            <NewNoteCard />
          </div>
          {!isNotesLoading &&
            notes &&
            notes.pages
              .map(({ items }) => items)
              .flat()
              .map((note, idx, arr) => {
                const className =
                  "rounded border border-neutral-900 p-4 text-center focus:outline-none";

                return (
                  <div key={note.id}>
                    <NoteCard noteId={note.id} />
                  </div>
                );
              })}
        </div>
      </main>
    </>
  );
};

export default Notes;
