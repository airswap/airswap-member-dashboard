import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextWithLineAfterProps {
  children: ReactNode;
  className?: string;
}

export const TextWithLineAfter: FC<TextWithLineAfterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        [
          "relative my-3 flex w-full items-center after:ml-2 after:h-[1px] after:flex-1",
        ],
        ["dark:after:bg-border-darkGray"],
        ["after:bg-bg-lightGray"],
        className,
      )}
    >
      <span className="relative text-font-lightBluePrimary dark:text-font-darkPrimary">
        {children}
      </span>
    </div>
  );
};
