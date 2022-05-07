import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import Badge from "../common/Badge";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  id: string;
  name: string;
  description: string | null;
  onMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

type TagFormFields = {
  name: string;
};

const NoteItem: React.FC<Props> = ({ id, name, description, onMenuClick }) => {
  const [tags, setTags] = useState<Array<string>>(["physics", "math"]);
  const [tagInputVisible, setTagInputVisible] = useState<boolean>(false);

  const { register, handleSubmit, resetField } = useForm<TagFormFields>();

  const closeTagInput = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTagInputVisible(false);
  };

  const openTagInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setTagInputVisible(true);
  };

  const onSubmit: SubmitHandler<TagFormFields> = async (data) => {
    setTags((prevTag) => [...prevTag, data.name]);
    console.log(data);
    resetField("name");
  };

  return (
    <Link
      to={`/notes/${id}`}
      className="flex flex-row justify-between bg-neutral-900 py-2 px-4 text-white rounded-lg cursor-pointer"
    >
      <div className="flex flex-col grow">
        <p className="text-xl font-bold">{name}</p>
        {description && <p>{description}</p>}
        <div className="flex flex-row py-2">
          {tags.map((t) => (
            <Badge title={t} />
          ))}
          <button
            onClick={openTagInput}
            className="px-2 hover:bg-neutral-700 text-neutral-400 rounded"
          >
            + add tag
          </button>
        </div>
        {tagInputVisible && (
          <div className="flex flex-row grow mt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex grow">
              <input
                autoComplete="off"
                className="p-1 grow bg-transparent border-b-2 border-b-neutral-600 focus:outline-none text-white"
                placeholder="add tag"
                onClick={(e) => e.preventDefault()}
                {...register("name", {
                  required: true,
                  minLength: 1
                })}
                type="text"
              />
            </form>
            <button onClick={closeTagInput}>
              <XIcon height={15} width={15} />
            </button>
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
