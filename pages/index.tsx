import type { NextPage } from "next";
import { useState } from "react";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [doc, setDoc] = useState<string>("");

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <div className="flex grow">
        <div className="flex-[0_0_25%]" />
        <div className="flex flex-col flex-grow">
          <button onClick={() => setPreviewOn((prev) => !prev)}>
            {previewOn ? "Editor" : "Preview"}
          </button>
          {previewOn ? (
            <Preview doc={doc} />
          ) : (
            <Editor
              doc={doc}
              onChange={(state) => setDoc(state.doc.toJSON().join("\n"))}
            />
          )}
        </div>
        <div className="flex-[0_0_25%]" />
      </div>
    </div>
  );
};

export default Home;
