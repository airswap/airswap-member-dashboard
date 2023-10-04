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
          significantFigures: 3,
        })}{" "}
        {symbol}
      </span>
      <span
        className={twJoin(
          "text-white font-medium text-right",
          amount != null ? "opacity-100" : "opacity-0",
          "transition-opacity",
        )}
      >
        ${value.toFixed(2)}
      </span>
    </>
  );
};

export const ClaimableTokensLineItemLoading = () => (
  <>
    <Checkbox isOptionButton disabled className="animate-pulse" />
    {/* Tokens */}
    <div className="inline-flex flex-row gap-1 animate-pulse">
      <span className="bg-gray-600 w-24 h-3.5" />
      <span className="bg-gray-600 w-6 h-3.5" />
    </div>

    <span className="bg-gray-400 w-10 h-3.5 justify-self-end animate-pulse" />
  </>
);
