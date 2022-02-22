import { useCallback, useState } from "react";
import NavBar from "../common/NavBar";
import Editor from "./Editor";
import Preview from "./Preview";

const Note: React.FC = () => {
  const [doc, setDoc] = useState<string>("# Hello, World!");

  const handleDocChange = useCallback((newDoc) => {
    setDoc(newDoc);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      <div className="flex grow">
        <Editor onChange={handleDocChange} initialDoc={doc} />
        <Preview doc={doc} />
      </div>
    </div>
  );
};

export default Note;
