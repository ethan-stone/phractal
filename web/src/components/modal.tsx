import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export type Props = {
  show: boolean;
  onClose: () => void;
  renderContent: (opts: { onClose: () => void }) => React.ReactElement;
};

const Modal: React.FC<Props> = (props) => {
  return (
    <Transition appear show={props.show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 min-h-screen overflow-y-auto">
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
            {props.renderContent({
              onClose: props.onClose,
            })}
            d
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
