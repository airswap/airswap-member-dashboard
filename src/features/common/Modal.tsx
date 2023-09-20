import { useKeyboardEvent } from "@react-hookz/web";
import { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { LineBreak } from "./LineBreak";

export const Modal = ({
  className,
  modalHeadline,
  onCloseRequest,
  children,
}: {
  className?: string;
  modalHeadline?: string;
  onCloseRequest: () => void;
  children?: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  // This component is intended to be rendered conditionally, so if it is
  // rendered we need to immediately show the modal dialog.
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, [modalRef]);

  // Close on escape pressed.
  useKeyboardEvent("Escape", () => {
    onCloseRequest();
  });

  return (
    <dialog
      ref={modalRef}
      className={twMerge(
        "backdrop:bg-gray-900 backdrop:bg-opacity-[85%] backdrop:backdrop-blur-[2px]",
        "bg-transparent",
        className,
      )}
    >
      <div className="px-6 py-7 bg-gray-900 border border-[#1F2937] rounded-lg">
        <div className="flex justify-between items-center mb-4 -mt-2">
          <h2 className="font-semibold text-xl">{modalHeadline}</h2>
          <div className="hover:cursor-pointer" onClick={onCloseRequest}>
            <MdClose className="text-gray-500" size={26} />
          </div>
        </div>
        <LineBreak className="mb-4 -mx-6" />
        {children}
      </div>
    </dialog>
  );
};
