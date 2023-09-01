import { FC } from "react";
import { twJoin } from "tailwind-merge";

interface LineBreakProps {
  className?: string;
}
const LineBreak: FC<LineBreakProps> = ({ className }) => {
  return (
    <hr
      className={twJoin([
        "border-t-1 absolute left-0 my-2 w-full border-border-darkGray",
        className,
      ])}
    />
  );
};

export default LineBreak;
