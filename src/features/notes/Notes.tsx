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
import NewNoteForm from "./NewNoteForm";

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

  const onSubmit: SubmitHandler<NewNoteFormFields> = async (data) => {
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
              {newNoteFormOpen && <NewNoteForm onSubmit={onSubmit} />}
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
