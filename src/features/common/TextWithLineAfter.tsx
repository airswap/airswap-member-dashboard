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
        "relative my-4 flex w-full items-center",
        "after:bg-gray-800 after:ml-2 after:h-[1px] after:flex-1",
        className,
      )}
    >
      <span className="uppercase text-sm font-semibold">{children}</span>
    </div>
  );
};
