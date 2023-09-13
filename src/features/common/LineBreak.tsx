import { twJoin } from "tailwind-merge";

export const LineBreak = ({ className }: { className?: string }) => {
  return (
    <hr
      className={twJoin([
        "border-t-1 left-0 w-full border-gray-800",
        className,
      ])}
    />
  );
};
