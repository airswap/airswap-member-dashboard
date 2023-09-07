import { format } from "@greypixel_/nicenumbers";
import { Checkbox } from "../common/Checkbox";
import { useClaimableAmount } from "./hooks/useClaimableAmount";

export const ClaimableTokensLineItem = ({
  tokenAddress,
  numPoints,
  isSelected,
  onSelect,
}: {
  tokenAddress: `0x${string}`;
  numPoints: number;
  isSelected: boolean;
  onSelect: (amount: bigint) => void;
}) => {
  const { isLoading, data } = useClaimableAmount({
    points: numPoints,
    tokenAddress,
  });

  if (isLoading || !data.claimableAmount || !data.tokenInfo) {
    return null;
  }

  return (
    <>
      <Checkbox
        isOptionButton
        checked={isSelected}
        onCheckedChange={(state) =>
          state === true &&
          data.claimableAmount &&
          onSelect(data.claimableAmount)
        }
      />
      <span className="text-gray-400">
        {format(data.claimableAmount, {
          tokenDecimals: data.tokenInfo.decimals,
        })}{" "}
        {data.tokenInfo.symbol}
      </span>
      <span className="text-white font-medium">$XXX</span>
    </>
  );
};
