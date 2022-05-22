import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import NavBar from "../common/NavBar";
import { Note, Tag } from "../../types";
import NoteItem from "./NoteItem";
import { createNote, listNotes } from "../../utils/api";
import { useFirebase } from "../../context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import NewNoteForm, { NewNoteOnSubmitData } from "./NewNoteForm";
import { Dialog, Transition } from "@headlessui/react";
import PopOver from "./PopOver";
import { TrashIcon } from "@heroicons/react/solid";

interface NoteWithTags extends Note {
  NoteTagJunction: Array<Tag>;
}

const Notes: React.FC = () => {
  const { getIdToken } = useFirebase();
  const [loading, setLoading] = useState<boolean>(false);
  const [newNoteFormOpen, setNewNoteFormOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteWithTags[]>([]);
  const [popOverPosition, setPopoverPosition] = useState<{
    x: number;
    y: number;
  } | null>();
  const navigate = useNavigate();

  async function _listNotes() {
    setLoading(true);

    const token = await getIdToken();

    const res = await listNotes(token, {
      withTags: true
    });

    if (res.data) {
      setNotes(res.data.notes as NoteWithTags[]);
    } else if (res.error) {
      // do something later
    }

    setLoading(false);
  }

  useEffect(() => {
    _listNotes();
  }, []);

  const onSubmit: SubmitHandler<NewNoteOnSubmitData> = async (data) => {
    const token = await getIdToken();

    const res = await createNote(
      token,
      data.name,
      data.description,
      data.isPrivate ? "PRIVATE" : "PUBLIC"
    );

    if (res.data) {
      navigate(`/notes/${res.data.id}`);
    } else if (res.error) {
      console.log(res.error);
    }
  };

  const onNoteItemMenuClicked: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    setPopoverPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <NavBar />
      {loading ? (
        <div className="flex grow justify-center items-center">Loading</div>
      ) : (
        <>
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
                <div className="flex flex-col mt-4">
                  {notes.map((note, idx) => (
                    <div key={note.id}>
                      <NoteItem
                        key={idx}
                        id={note.id}
                        name={note.name}
                        tags={note.NoteTagJunction?.map((t) => t.tag.name)}
                        description={note.description}
                        onMenuClick={onNoteItemMenuClicked}
                      />
                      <div className="h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Transition appear show={newNoteFormOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-20 overflow-y-auto"
              onClose={() => setNewNoteFormOpen(false)}
            >
              <div className="flex min-h-screen items-center justify-center bg-neutral-800/90">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="flex flex-col w-1/3 align-middle transition-all transform bg-neutral-900 p-4 mt-4 rounded-lg shadow-lg">
                    <NewNoteForm onSubmit={onSubmit} />
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
          {popOverPosition && (
            <PopOver
              onClickOutside={() => setPopoverPosition(null)}
              position={{ x: popOverPosition.x, y: popOverPosition.y }}
            >
              <div className="flex flex-col grow p-2">
                <button
                  type="button"
                  onClick={() => setNewNoteFormOpen(true)}
                  className="flex grow flex-row bg-red-200 p-1 rounded shadow-lg justify-center items-center"
                >
                  <TrashIcon className="h-5 text-red-800 mr-2" />
                  <p className="text-red-800 font-bold">Delete Note</p>
                </button>
              </div>
            </PopOver>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
