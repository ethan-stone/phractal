import { useRouter } from "next/router";

const NoteCard: React.FC<{ noteId: string }> = ({ noteId }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        void router.push(`/notes/${noteId}`);
      }}
      className="w-full cursor-pointer rounded-2xl border-2 border-gray-500 px-4 py-10 text-left shadow-xl"
    >
      <h3 className="text-md text-gray-900">Title</h3>
      <p className="mt-2 text-sm text-gray-500">Description</p>
    </button>
  );
};

export default NoteCard;
