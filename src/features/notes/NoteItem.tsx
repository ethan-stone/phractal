import { Link } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/solid";
import Badge from "../common/Badge";

type Props = {
  id: string;
  name: string;
  description: string | null;
  onMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const NoteItem: React.FC<Props> = ({ id, name, description, onMenuClick }) => {
  return (
    <Link
      to={`/notes/${id}`}
      className="flex flex-row justify-between bg-neutral-900 py-2 px-4 text-white rounded-lg cursor-pointer"
    >
      <div className="flex flex-col">
        <p className="text-xl font-bold">{name}</p>
        {description && <p>{description}</p>}
        <div className="flex flex-row py-2">
          <Badge title="Physics" />
          <Badge title="Math" />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button
          className="flex justify-center items-center rounded p-2 bg-neutral-800 hover:bg-neutral-700"
          onClick={onMenuClick}
        >
          <MenuIcon height={20} width={20} />
        </button>
      </div>
    </Link>
  );
};

export default NoteItem;
