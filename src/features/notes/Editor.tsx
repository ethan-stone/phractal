import React, { useCallback, useEffect } from "react";
import useCodeMirror from "../../hooks/useCodeMirror";

interface Props {
  initialDoc: string;
  onChange: (doc: string) => void;
}

const Editor: React.FC<Props> = (props) => {
  const { onChange, initialDoc } = props;
  const handleChange = useCallback(
    (state) => onChange(state.doc.toString()),
    [onChange]
  );
  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: initialDoc,
    onChange: handleChange
  });

  useEffect(() => {
    if (editorView) {
      // do nothing for now
    }
  }, [editorView]);
  return <div className="flex-[0_0_49%] bg-neutral-800" ref={refContainer} />;
};

export default Editor;