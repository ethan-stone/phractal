type Props = {
  title: string;
};

const Badge: React.FC<Props> = ({ title, children }) => {
  return (
    <span className="flex flex-row items-center justify-center bg-white text-neutral-800 text-xs font-bold rounded-full px-2 py-1 mr-2">
      {title}
      {children}
    </span>
  );
};

export default Badge;
