import React, { createElement, Fragment } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import RemarkCode from "./RemarkCode";

type Props = {
  doc: string;
};

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"]
  }
};

const Preview: React.FC<Props> = (props) => {
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        code: RemarkCode
      }
    })
    .processSync(props.doc);

  return <div className="flex-[0_0_50%] markdown-body">{md.result}</div>;
};

export default Preview;
