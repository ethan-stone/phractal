import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import NavBar from "../common/NavBar";
import { XIcon } from "@heroicons/react/solid";

type NewNoteFormFields = {
  name: string;
  description: string;
};

const Notes: React.FC = () => {
  const { register, handleSubmit } = useForm<NewNoteFormFields>();
  const [newNoteFormOpen, setNewNoteFormOpen] = useState<boolean>(false);

  const onSumbit: SubmitHandler<NewNoteFormFields> = async (data) => {
    console.log(data);
  };

  const inputStyles =
    "p-2 m-2 rounded-lg grow bg-gray-800 border-white border focus:outline-none focus:border-2 text-white";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      <div className="flex grow justify-center">
        <div className="flex justify-center w-1/3 p-3">
          <div className="flex flex-col grow">
            <button
              type="button"
              onClick={() => setNewNoteFormOpen(true)}
              className="bg-gray-800 text-white p-3 rounded-lg"
            >
              New Note
            </button>
            {newNoteFormOpen && (
              <form
                className="flex flex-col bg-gray-800 p-4 mt-4 rounded-lg"
                onSubmit={handleSubmit(onSumbit)}
              >
                <div className="flex flex-row justify-end mb-1">
                  <XIcon
                    className="text-white w-4 h-4 justify-end cursor-pointer"
                    onClick={() => setNewNoteFormOpen(false)}
                  />
                </div>
                <input
                  placeholder="name"
                  autoComplete="off"
                  className={inputStyles}
                  {...register("name")}
                />
                <input
                  placeholder="description"
                  autoComplete="off"
                  className={inputStyles}
                  {...register("description")}
                />
                <button
                  type="submit"
                  className="bg-white text-gray-800 p-2 rounded-lg m-2 font-bold"
                >
                  Create
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
