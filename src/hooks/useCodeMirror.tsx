import { useState, useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { history, historyKeymap } from "@codemirror/history";
import { indentOnInput } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import {
  defaultHighlightStyle,
  HighlightStyle,
  tags
} from "@codemirror/highlight";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark, oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import type React from "react";

const cursor = "#ffffff";
const background = "#262626";
const darkBackground = "#171717";
const highlightBackground = "#171717";
const tooltipBackground = "#353a42";
const selection = "#404040";
const ivory = "#abb2bf";
const stone = "#525252";

const theme = EditorView.theme(
  {
    "&": {
      color: ivory,
      backgroundColor: background,
      height: "100%"
    },
    ".cm-content": { caretColor: cursor },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },
    ".cm-panels": { backgroundColor: darkBackground, color: ivory },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f"
    },
    ".cm-activeLine": { backgroundColor: highlightBackground },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847",
      outline: "1px solid #515a6b"
    },

    ".cm-gutters": {
      backgroundColor: background,
      color: stone,
      border: "none"
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd"
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: ivory
      }
    }
  },
  { dark: true }
);

const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: "1.6em",
    fontWeight: "bold"
  },
  {
    tag: tags.heading2,
    fontSize: "1.4em",
    fontWeight: "bold"
  },
  {
    tag: tags.heading3,
    fontSize: "1.2em",
    fontWeight: "bold"
  }
]);

interface Props {
  initialDoc: string;
  onChange?: (state: EditorState) => void;
}

const useCodeMirror = <T extends Element>(
  props: Props
): [React.MutableRefObject<T | null>, EditorView?] => {
  const refContainer = useRef<T>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const { onChange } = props;

  useEffect(() => {
    if (!refContainer.current) return;

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true
        }),
        oneDarkHighlightStyle,
        theme,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) [onChange && onChange(update.state)];
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current
    });

    setEditorView(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refContainer]);

  return [refContainer, editorView];
};

export default useCodeMirror;
