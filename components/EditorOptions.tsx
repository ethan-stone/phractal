import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

type Props = {
  previewOn: boolean;
  onTogglePreview: () => void;
};

const iconStyles = "h-6 w-6 text-white";

const EditorOptions: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-row items-center justify-center p-2 border-b border-neutral-400">
      <button onClick={() => props.onTogglePreview()}>
        {props.previewOn ? (
          <EyeOffIcon className={iconStyles} />
        ) : (
          <EyeIcon className={iconStyles} />
        )}
      </button>
    </div>
  );
};

export default EditorOptions;
