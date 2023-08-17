import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useContractRead, useToken } from "wagmi";
import { AirSwapPoolAbi } from "../../../abi/AirSwapPool";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";

export const useClaimableAmount = ({
  points,
  tokenAddress,
  chainId,
}: {
  points: number;
  tokenAddress: `0x${string}`;
  chainId?: number;
}) => {
  const [AirSwapPool] = useContractAddresses([ContractTypes.AirSwapPool], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  const { data: tokenInfo, isLoading: infoLoading } = useToken({
    address: tokenAddress,
    chainId,
    cacheTime: 2_592_000_000, // 1 month
    staleTime: Infinity, // doesn't change
  });

  const { data: claimableAmount, isLoading: amountLoading } = useContractRead({
    address: AirSwapPool.address,
    chainId: AirSwapPool.chainId,
    abi: AirSwapPoolAbi,
    functionName: "calculate",
    args: [
      BigInt(new BigNumber(points.toString()).multipliedBy(10 ** 4).toString()),
      tokenAddress,
    ],
  });

  return useMemo(() => {
    return {
      data: {
        claimableAmount: claimableAmount,
        tokenInfo: tokenInfo,
      },
      isLoading: infoLoading || amountLoading,
    };
  }, [claimableAmount, tokenInfo, amountLoading, infoLoading]);
};
