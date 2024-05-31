import { twJoin } from "tailwind-merge";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { Checkbox } from "../common/Checkbox";
import { formatNumber } from "../common/utils/formatNumber";

export const ClaimableTokensLineItem = ({
  symbol,
  amount,
  decimals,
  value,
  isSelected,
  onSelect,
  isCustomToken = false,
  address,
}: {
  symbol: string;
  decimals: number;
  amount: bigint;
  value: number;
  isSelected: boolean;
  onSelect: () => void;
  isCustomToken?: boolean;
  address: Address;
}) => {
  const chainId = useChainId();
  // const removeCustomToken = useClaimSelectionStore(
  //   (state) => state.removeCustomToken,
  // );

  return (
    <>
      <Checkbox
        isOptionButton
        checked={isSelected}
        onCheckedChange={(state) => state === true && onSelect()}
      />
      <span className="text-gray-400 inline-flex gap-2 items-center">
        {formatNumber(amount, decimals)} {symbol}
        {/* {isCustomToken && (
          <button onClick={() => removeCustomToken(chainId, address)}>
            <IoMdClose className="text-red-500" />
          </button>
        )} */}
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
