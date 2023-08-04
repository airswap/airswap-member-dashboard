import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextWithLineAfterProps {
  children: ReactNode;
  className?: string;
}

export const TextWithLineAfter: FC<TextWithLineAfterProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "relative flex items-center my-3 w-full after:h-[1px] after:ml-2 after:flex-1 after:bg-bg-lightGray dark:after:bg-border-darkGray",
        className,
      )}
    >
      <span className="relative text-font-lightBluePrimary dark:text-font-darkPrimary">
        {children}
      </span>
    </div>
  );
};
