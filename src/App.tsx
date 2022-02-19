import { useCallback, useState } from "react";
import logo from "./logo.svg";
import "./index.css";
import Editor from "./features/notes/Editor";
import Preview from "./features/notes/Preview";

function App() {
  const [doc, setDoc] = useState<string>("# Hello, World!");

  const handleDocChange = useCallback((newDoc) => {
    setDoc(newDoc);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-row">
      <Editor onChange={handleDocChange} initialDoc={doc} />
      <Preview doc={doc} />
    </div>
  );
}

export default App;
