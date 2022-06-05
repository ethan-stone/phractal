import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../common/NavBar";
import Editor from "./Editor";
import Preview from "./Preview";
import { addTag, retrieveNote, updateNote } from "../../utils/api/notes";
import { useFirebase } from "../../context/FirebaseContext";
import { SubmitHandler, useForm } from "react-hook-form";
import Badge from "../common/Badge";
import { Note, Tag } from "../../types";

interface NoteWithTagsAndContent extends Note {
  content: string;
  NoteTagJunction: Array<Tag>;
}

type TagFormFields = {
  name: string;
};

type NewTagFormProps = {
  onSubmit: (data: TagFormFields) => void | Promise<void>;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const NewTagForm: React.FC<NewTagFormProps> = ({
  onSubmit,
  onBlur,
  onKeyDown
}) => {
  const { register, handleSubmit, resetField, setFocus } =
    useForm<TagFormFields>();

  const _onSubmit: SubmitHandler<TagFormFields> = async (data) => {
    await onSubmit(data);
    resetField("name");
  };

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <input
        autoComplete="off"
        className="px-2 bg-neutral-700 rounded focus:outline-none text-white"
        placeholder="add tag"
        {...register("name", {
          required: true,
          minLength: 1,
          onBlur: onBlur
        })}
        onKeyDown={onKeyDown}
        type="text"
      />
    </form>
  );
};

const NotePage: React.FC = () => {
  const { getIdToken } = useFirebase();
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<Array<string>>([]);
  const [note, setNote] = useState<NoteWithTagsAndContent>();
  const [tagInputVisible, setTagInputVisible] = useState<boolean>(false);

  const openTagInput = () => {
    setTagInputVisible(true);
  };

  async function _retrieveNote() {
    setLoading(true);

    const token = await getIdToken();

    const res = await retrieveNote(token, id as string, {
      withContent: true,
      withTags: true
    });

    if (res.data) {
      const note = res.data.note as NoteWithTagsAndContent;
      setDoc(note.content);
      setTags(note.NoteTagJunction.map((t) => t.tag.name));
      setNote(note);
    } else if (res.error) {
      // do something later
    }

    setLoading(false);
  }

  async function _updateNote() {
    const token = await getIdToken();

    const res = await updateNote(token, id as string, {
      content: doc
    });

    if (res.data) {
      // do something later
    } else {
      // do something later
    }
  }

  useEffect(() => {
    _retrieveNote();
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      _updateNote();
    }, 5000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [doc]);

  const handleDocChange = useCallback((newDoc) => {
    setDoc(newDoc);
  }, []);

  const onSubmit = async (data: TagFormFields) => {
    setTags((prevTags) => [...prevTags, data.name]);

    const token = await getIdToken();
    await addTag(token, id as string, data.name);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <NavBar />
      <div className="bg-neutral-800 border-b border-white p-4">
        <div className="flex flex-row">
          <p className="font-bold text-white text-2xl">{note?.name}</p>
        </div>
        <div className="flex flex-row mt-2">
          {tags.map((t, i) => (
            <Badge key={i} title={t} />
          ))}
          {tagInputVisible ? (
            <NewTagForm
              onSubmit={onSubmit}
              onBlur={() => setTagInputVisible(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setTagInputVisible(false);
                }
              }}
            />
          ) : (
            <button
              onClick={openTagInput}
              className="px-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded"
            >
              + add tag
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex grow items-center justify-center">Loading</div>
      ) : (
        <div className="flex grow">
          <Editor onChange={handleDocChange} initialDoc={doc} />
          <div className="flex-[0_0_2%]" />
          <Preview doc={doc} />
        </div>
      )}
    </div>
  );
};

export default NotePage;
