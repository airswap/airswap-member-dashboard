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

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, [modalRef]);

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
        className,
      )}
    >
      <div className="p-4">{children}</div>
    </dialog>
  );
};
