import { useKeyboardEvent } from "@react-hookz/web";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export const Modal = ({
  className,
  onCloseRequest,
  children,
}: {
  className?: string;
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
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Clicked on the background
          onCloseRequest();
        }
      }}
      className={twMerge(
        "backdrop:bg-slate-900/50 backdrop:backdrop-blur-[2px]",
        "bg-transparent",
        className,
      )}
    >
      <div className="px-6 py-7 bg-gray-900 border border-[#1F2937] rounded-lg">
        {children}
      </div>
    </dialog>
  );
};
