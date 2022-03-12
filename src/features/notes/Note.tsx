import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../common/NavBar";
import Editor from "./Editor";
import Preview from "./Preview";
import { retrieveNote, updateNote } from "../../utils/api/notes";
import { useFirebase } from "../../context/FirebaseContext";
import { User } from "firebase/auth";

const NotePage: React.FC = () => {
  const { getIdToken } = useFirebase();
  const { id } = useParams<{ id: string }>();

  const [doc, setDoc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function _retrieveNote() {
    setLoading(true);

    const token = await getIdToken();

    const res = await retrieveNote(token, id as string);

    if (res.data) {
      setDoc(res.data.note.content);
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

  // useEffect(() => {
  //   const updateInterval = setInterval(() => {
  //     _updateNote();
  //   }, 5000);

  //   return () => {
  //     clearInterval(updateInterval);
  //   };
  // }, [doc]);

  const handleDocChange = useCallback((newDoc) => {
    setDoc(newDoc);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <NavBar />
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
