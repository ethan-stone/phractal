import { highlightTree } from "@lezer/highlight";
import { languages } from "@codemirror/language-data";
import {
  HighlightStyle,
  Language,
  LanguageDescription
} from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  whiskey = "#d19a66",
  violet = "#c678dd",
  darkBackground = "#21252b",
  highlightBackground = "#2c313a",
  background = "#282c34",
  tooltipBackground = "#353a42",
  selection = "#3E4451",
  cursor = "#528bff";

export const oneDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: coral
  },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: ivory },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace
    ],
    color: chalky
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string)
    ],
    color: cyan
  },
  { tag: [t.meta, t.comment], color: stone },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: stone, textDecoration: "underline" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: t.invalid, color: invalid }
]);

type RunModeCallback = (
  text: string,
  style: string | null,
  from: number,
  to: number
) => void;

function runmode(
  textContent: string,
  language: Language,
  callback: RunModeCallback
): void {
  const tree = language.parser.parse(textContent);
  let pos = 0;
  highlightTree(tree, oneDarkHighlightStyle, (from, to, classes) => {
    if (from > pos) {
      callback(textContent.slice(pos, from), null, pos, from);
    }
    callback(textContent.slice(from, to), classes, from, to);
    pos = to;
  });
  if (pos !== tree.length) {
    callback(textContent.slice(pos, tree.length), null, pos, tree.length);
  }
}

export function findLanguage(langName: string): LanguageDescription | null {
  const i = languages.findIndex((lang: LanguageDescription) => {
    if (lang.alias.indexOf(langName) >= 0) {
      return true;
    }
  });
  if (i >= 0) {
    return languages[i];
  } else {
    return null;
  }
}

export async function getLanguage(langName: string): Promise<Language | null> {
  const desc = findLanguage(langName);
  if (desc) {
    const langSupport = await desc.load();
    return langSupport.language;
  } else {
    return null;
  }
}

export default runmode;
