import { format } from "@greypixel_/nicenumbers";
import { twJoin } from "tailwind-merge";
import { Checkbox } from "../common/Checkbox";

export const ClaimableTokensLineItem = ({
  symbol,
  amount,
  decimals,
  value,
  isSelected,
  onSelect,
}: {
  symbol: string;
  decimals: number;
  amount: bigint;
  value: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <>
      <Checkbox
        isOptionButton
        checked={isSelected}
        onCheckedChange={(state) => state === true && onSelect()}
      />
      <span className="text-gray-400">
        {format(amount, {
          tokenDecimals: decimals,
        })}{" "}
        {symbol}
      </span>
      <span
        className={twJoin(
          "text-white font-medium",
          amount && symbol ? "opacity-100" : "opacity-0",
          "transition-opacity",
        )}
      >
        ${value.toFixed(2)}
      </span>
    </>
  );
};
