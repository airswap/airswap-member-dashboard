import { useKeyboardEvent } from "@react-hookz/web";
import { ReactNode, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export const Modal = ({
  className,
  heading,
  subHeading,
  onCloseRequest,
  children,
}: {
  className?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  onCloseRequest: () => void;
  children?: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  // This component is intended to be rendered conditionally, so if it is
  // rendered we need to immediately show the modal dialog.
  useEffect(() => {
    if (modalRef.current && !modalRef.current.hasAttribute("open")) {
      modalRef.current.showModal();
    }
  }, [modalRef]);

  // Close on escape pressed.
  useKeyboardEvent("Escape", () => {
    onCloseRequest && onCloseRequest();
    modalRef.current?.close();
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-white mb-1">{heading}</h2>
          <button onClick={onCloseRequest}>
            <MdClose className="text-gray-500" size={24} />
          </button>
        </div>
        {subHeading && <h3 className="text-gray-400">{subHeading}</h3>}
        <hr className="border-gray-800 -mx-6 my-6" />

        {children}
      </div>
    </dialog>
  );
};
