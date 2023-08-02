import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const TextLineAfter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <div
      className={twMerge(
        "relative flex items-center my-4 w-full after:w-[calc(100%_-_100%)] after:h-0.5 after:ml-2 after:flex-1 after:bg-border-darkLight",
        className,
      )}
    >
      <span className="text-block relative">
        {children}
      </span>
    </div>
  );
};
