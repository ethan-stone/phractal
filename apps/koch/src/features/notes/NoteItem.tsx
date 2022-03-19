import { Link } from "react-router-dom";
type Props = {
  id: string;
  name: string;
  description: string | null;
};

const NoteItem: React.FC<Props> = ({ id, name, description }) => {
  return (
    <Link
      to={`/notes/${id}`}
      className="flex flex-col justify-start bg-neutral-900 py-2 px-4 text-white rounded-lg cursor-pointer"
    >
      <p className="text-xl font-bold">{name}</p>
      {description && <p>{description}</p>}
    </Link>
  );
};

export default NoteItem;
