import { EditorState } from "@codemirror/state";
import { useCallback, useEffect } from "react";
import useCodeMirror from "../hooks/useCodeMirror";

const Editor: React.FC = () => {
  const onChange = useCallback(
    (state: EditorState) => console.log(state.doc.toJSON()),
    []
  );
  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: "Hello World",
    onChange: onChange
  });

  useEffect(() => {
    if (editorView) {
      // do nothing for now
    }
  }, [editorView]);

  return <div className="flex-[0_0_50%]" ref={refContainer} />;
};

export default Editor;
