import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  className,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={twMerge(
        "rounded-full px-5 py-3 border border-border-dark transition-colors",
        "hover:border-white",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
