import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import NavBar from "../common/NavBar";
import { XIcon } from "@heroicons/react/solid";
import { Note } from "../../types";
import NoteItem from "./NoteItem";
import { createNote, retrieveNotes } from "../../utils/api";
import { useFirebase } from "../../context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";

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
  const [isPrivate, setIsPrivate] = useState(false);
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

    const res = await createNote(
      token,
      data.name,
      data.description,
      isPrivate ? "PRIVATE" : "PUBLIC"
    );

    if (res.data) {
      navigate(`/notes/${res.data.id}`);
    } else if (res.error) {
      console.log(res.error);
    }
  };

  const inputStyles =
    "p-2 m-2 rounded-md grow bg-neutral-800 focus:outline-none text-white";

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
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
                className="bg-neutral-900 p-3 rounded-lg shadow-lg"
              >
                <p className="text-white">New Note</p>
              </button>
              {newNoteFormOpen && (
                <form
                  className="flex flex-col bg-neutral-900 p-4 mt-4 rounded-lg shadow-lg"
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
                  <div className="flex flex-row p-2">
                    <label className="pr-4 text-neutral-50">Private</label>
                    <Switch
                      checked={isPrivate}
                      onChange={setIsPrivate}
                      className={`${
                        isPrivate ? "bg-neutral-600" : "bg-neutral-800"
                      }
                    relative inline-flex flex-shrink-0 h-[24px] w-[44px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          isPrivate ? "translate-x-5" : "translate-x-0"
                        }
                      pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                      />
                    </Switch>
                  </div>
                  <button
                    type="submit"
                    className="bg-neutral-50 text-neutral-800 p-2 rounded-md m-2 font-bold"
                  >
                    Create
                  </button>
                </form>
              )}
              <div className="flex flex-col mt-4">
                {notes.map((note, idx) => (
                  <>
                    <NoteItem
                      key={idx}
                      id={note.id}
                      name={note.name}
                      description={note.description}
                    />
                    <div className="h-4" />
                  </>
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
