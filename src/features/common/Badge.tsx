type Props = {
  title: string;
};

const Badge: React.FC<Props> = ({ title }) => {
  return (
    <span className="bg-white text-neutral-800 text-xs font-bold rounded-full py-1 px-2 mr-1">
      {title}
    </span>
  );
};

export default Badge;
