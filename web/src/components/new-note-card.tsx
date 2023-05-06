"use client";

import { api } from "@/utils/api";
import { useRouter } from "next/router";

const NewNoteCard: React.FC = () => {
  const router = useRouter();

  const { mutate: newNote } = api.notes.newNote.useMutation({
    onSuccess(data) {
      void router.push(`/notes/${data.id}`);
    },
  });

  return (
    <button
      className="h-80 w-60 cursor-pointer rounded-2xl border-2 border-dashed border-gray-500 p-4 py-10 text-left shadow-xl"
      onClick={() => newNote()}
    >
      <h3 className="text-md text-gray-900">New Note</h3>
      <p className="mt-2 text-sm text-gray-500">Create a new note</p>
    </button>
  );
};

export default NewNoteCard;
