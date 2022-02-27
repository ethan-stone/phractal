import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import NavBar from "../common/NavBar";
import Editor from "./Editor";
import Preview from "./Preview";
import { retrieveNote, updateNote } from "../../utils/api/notes";
import { CognitoUser } from "@aws-amplify/auth";

type Props = {
  id: string;
};

const NotePage: React.FC<Props> = () => {
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();

  const [doc, setDoc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function _retrieveNote() {
    setLoading(true);

    const res = await retrieveNote(id as string, user as CognitoUser);

    if (res.data) {
      setDoc(res.data.note.content);
    } else if (res.error) {
      // do something later
    }

    setLoading(false);
  }

  async function _updateNote() {
    const res = await updateNote(id as string, user as CognitoUser, {
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      {loading ? (
        <div className="flex grow items-center justify-center">Loading</div>
      ) : (
        <div className="flex grow">
          <Editor onChange={handleDocChange} initialDoc={doc} />
          <Preview doc={doc} />
        </div>
      )}
    </div>
  );
};

export default NotePage;
