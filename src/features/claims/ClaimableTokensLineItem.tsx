import { format } from "@greypixel_/nicenumbers";
import { useClaimableAmount } from "./hooks/useClaimableAmount";

export const ClaimableTokensLineItem = ({
  tokenAddress,
  numPoints,
}: {
  tokenAddress: `0x${string}`;
  numPoints: number;
}) => {
  const { isLoading, data } = useClaimableAmount({
    points: numPoints,
    tokenAddress,
  });

  if (isLoading || !data.claimableAmount || !data.tokenInfo) {
    return null;
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <span className="">
        {format(data.claimableAmount, {
          tokenDecimals: data.tokenInfo.decimals,
        })}{" "}
        {data.tokenInfo.symbol}
      </span>
      <span className="">$XXX</span>
    </div>
  );
};
