import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Editor from "../../components/Editor";
import EditorOptions from "../../components/EditorOptions";
import Preview from "../../components/Preview";

const Note: NextPage = () => {
  const { status } = useSession({ required: true });
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [doc, setDoc] = useState<string>("");

  if (status === "loading")
    return (
      <div className="flex flex-col min-h-screen bg-neutral-800">
        <div className="flex grow">Loading</div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <div className="flex grow">
        <div className="flex grow flex-col">
          <EditorOptions
            previewOn={previewOn}
            onTogglePreview={() => setPreviewOn((prev) => !prev)}
          />
          <div className="flex grow flex-row p-2">
            <div className="flex-[0_0_25%]" />
            <div className="flex flex-col flex-grow">
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
      </div>
    </div>
  );
};

export default Note;
