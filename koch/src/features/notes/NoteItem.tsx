import { Link } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/solid";
import Badge from "../common/Badge";

type Props = {
  id: string;
  name: string;
  description: string | null;
  tags: Array<string>;
  onMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const NoteItem: React.FC<Props> = ({
  id,
  name,
  description,
  tags,
  onMenuClick
}) => {
  return (
    <Link
      to={`/notes/${id}`}
      className="flex flex-row justify-between bg-neutral-900 py-2 px-4 text-white rounded-lg cursor-pointer"
    >
      <div className="flex flex-col grow">
        <p className="text-xl font-bold">{name}</p>
        {description && <p>{description}</p>}
        {tags.length > 0 && (
          <div className="flex flex-row py-2">
            {tags.map((t, i) => (
              <Badge key={i} title={t} />
            ))}
          </div>
        )}
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
