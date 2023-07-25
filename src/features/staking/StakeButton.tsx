import { format } from "@greypixel_/nicenumbers";
import { Button } from "../common/Button";

export const StakeButton = ({}: {}) => {
  const balance = "1500000000";
  const formattedBalance = format(balance, { tokenDecimals: 4 }) + " sAST";
  return (
    <div className="flex flex-row gap-4 items-center border border-border-dark px-5 py-3">
      <span className="font-medium">{formattedBalance}</span>
      <Button className="-my-3 -mr-5 bg-accent-blue uppercase font-bold">
        Stake
      </Button>
    </div>
  );
};
