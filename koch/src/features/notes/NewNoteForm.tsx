import { Switch } from "@headlessui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type NewNoteFormFields = {
  name: string;
  description: string;
};

export type NewNoteOnSubmitData = NewNoteFormFields & {
  isPrivate: boolean;
};

type Props = {
  onSubmit: (data: NewNoteOnSubmitData) => void | Promise<void>;
};

const NewNoteForm: React.FC<Props> = ({ onSubmit }) => {
  const inputStyles =
    "p-2 m-2 rounded-md grow bg-neutral-800 focus:outline-none text-white";

  const { register, handleSubmit } = useForm<NewNoteFormFields>();
  const [isPrivate, setIsPrivate] = useState(false);

  const _onSubmit: SubmitHandler<NewNoteFormFields> = async (data) => {
    await onSubmit({ ...data, isPrivate });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(_onSubmit)}>
      <input
        placeholder="name"
        autoComplete="off"
        className={inputStyles}
        {...register("name")}
      />
      <input
        placeholder="description"
        autoComplete="off"
        className={inputStyles}
        {...register("description")}
      />
      <div className="flex flex-row p-2">
        <label className="pr-4 text-neutral-50">Private</label>
        <Switch
          checked={isPrivate}
          onChange={setIsPrivate}
          className={`${isPrivate ? "bg-neutral-600" : "bg-neutral-800"}
                    relative inline-flex flex-shrink-0 h-[24px] w-[44px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${isPrivate ? "translate-x-5" : "translate-x-0"}
                      pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </div>
      <button
        type="submit"
        className="bg-neutral-50 text-neutral-800 p-2 rounded-md m-2 font-bold"
      >
        Create
      </button>
    </form>
  );
};

export default NewNoteForm;
