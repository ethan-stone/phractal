import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import NavBar from "../common/NavBar";
import { XIcon } from "@heroicons/react/solid";
import { useUser } from "../../context/AuthContext";
import { Note } from "../../types";
import NoteItem from "./NoteItem";
import { retrieveNotes } from "../../utils/api";
import { CognitoUser } from "@aws-amplify/auth";

type NewNoteFormFields = {
  name: string;
  description: string;
};

const Notes: React.FC = () => {
  const { user } = useUser();
  const { register, handleSubmit } = useForm<NewNoteFormFields>();
  const [loading, setLoading] = useState<boolean>(false);
  const [newNoteFormOpen, setNewNoteFormOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);

  async function _retrieveNotes() {
    setLoading(true);

    const res = await retrieveNotes(user as CognitoUser);

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
    await fetch(
      "https://kllx4ijj38.execute-api.us-east-1.amazonaws.com/notes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user
            ?.getSignInUserSession()
            ?.getIdToken()
            .getJwtToken()}`
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description
        })
      }
    );
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
