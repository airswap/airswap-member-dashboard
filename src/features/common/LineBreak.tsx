import { twJoin } from "tailwind-merge";

export const LineBreak = ({ className }: { className?: string }) => {
  return (
    <div
      className={twJoin(
        // FIXME: border-b should be a less hacky solution
        "min-w-full bg-gray-800 h-0.5 border-b border-gray-900",
        className,
      )}
    />
  );
};
