interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  name: string;
  tags: string[];
}

const Node: React.FC<Props> = (props) => {
  return (
    <button
      className="flex flex-col p-2 m-2 border border-white text-white"
      onClick={props.onClick}
    >
      <a>{props.name}</a>
      <div className="flex flex-row">{props.tags}</div>
    </button>
  );
};

export default Node;
