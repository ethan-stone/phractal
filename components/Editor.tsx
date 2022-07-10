import { EditorState } from "@codemirror/state";
import { useCallback, useEffect } from "react";
import useCodeMirror from "../hooks/useCodeMirror";

type Props = {
  doc: string;
  onChange: (state: EditorState) => void;
};

const Editor: React.FC<Props> = (props) => {
  const onChange = useCallback(
    (state: EditorState) => props.onChange(state),
    [props]
  );
  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: props.doc,
    onChange: onChange
  });

  useEffect(() => {
    if (editorView) {
      // do nothing for now
    }
  }, [editorView]);

  return (
    <div
      className="flex-[0_0_50%] grow bg-neutral-900 p-2 rounded"
      ref={refContainer}
    />
  );
};

export default Editor;
