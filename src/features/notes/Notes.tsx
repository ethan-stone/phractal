import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import NavBar from "../common/NavBar";
import { XIcon } from "@heroicons/react/solid";
import { Note } from "../../types";
import NoteItem from "./NoteItem";
import { createNote, retrieveNotes } from "../../utils/api";
import { useFirebase } from "../../context/FirebaseContext";
import { useNavigate } from "react-router-dom";

type NewNoteFormFields = {
  name: string;
  description: string;
};

const Notes: React.FC = () => {
  const { getIdToken } = useFirebase();
  const { register, handleSubmit } = useForm<NewNoteFormFields>();
  const [loading, setLoading] = useState<boolean>(false);
  const [newNoteFormOpen, setNewNoteFormOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  async function _retrieveNotes() {
    setLoading(true);

    const token = await getIdToken();

    const res = await retrieveNotes(token);

    if (res.data) {
      setNotes(res.data.notes);
    } else if (res.error) {
      // do something later
    }

    setLoading(false);
  }

  useEffect(() => {
    _retrieveNotes();
  }, []);

  const onSumbit: SubmitHandler<NewNoteFormFields> = async (data) => {
    const token = await getIdToken();

    const res = await createNote(token, data.name, data.description);

    if (res.data) {
      navigate(`/notes/${res.data.id}`);
    } else if (res.error) {
      console.log(res.error);
    }
  };

  const inputStyles =
    "p-2 m-2 rounded-lg grow bg-gray-800 border-white border focus:outline-none focus:border-2 text-white";

  return (
    <div className="flex flex-col min-h-screen bg-gray-700">
      <NavBar />
      {loading ? (
        <div className="flex grow justify-center items-center">Loading</div>
      ) : (
        <div className="flex grow justify-center">
          <div className="flex justify-center w-1/3 p-3">
            <div className="flex flex-col grow">
              <button
                type="button"
                onClick={() => setNewNoteFormOpen(true)}
                className="bg-gray-800 text-white p-3 rounded-lg shadow-lg"
              >
                New Note
              </button>
              {newNoteFormOpen && (
                <form
                  className="flex flex-col bg-gray-800 p-4 mt-4 rounded-lg shadow-lg"
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
              <div className="flex flex-col mt-4">
                {notes.map((note, idx) => (
                  <NoteItem
                    key={idx}
                    id={note.id}
                    name={note.name}
                    description={note.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
