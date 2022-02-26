import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactRouterLocation } from "../../types";
import NavBar from "../common/NavBar";
import Editor from "./Editor";
import Preview from "./Preview";

type Props = {
  id: string;
};

const NotePage: React.FC<Props> = () => {
  const location = useLocation();
  const { state } = location as ReactRouterLocation;
  const [doc, setDoc] = useState<string>(state?.note?.content);

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

export default NotePage;
