const NoteCard: React.FC = () => {
  return (
    <div className="cursor-pointer rounded-2xl border-2 border-gray-500 p-4 shadow-xl">
      <h3 className="text-md text-gray-900">Title</h3>
      <p className="mt-2 text-sm text-gray-500">Description</p>
    </div>
  );
};

export default NoteCard;
