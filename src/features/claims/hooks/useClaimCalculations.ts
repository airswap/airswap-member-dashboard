import { useChainId, useQuery } from "wagmi";
import { multicall } from "wagmi/actions";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { poolAbi } from "../../../contracts/poolAbi";

export const useClaimCalculations = (
  points: number,
  claimableTokens: `0x${string}`[],
) => {
  const chainId = useChainId();
  const [poolContract] = useContractAddresses([ContractTypes.AirSwapPool], {
    useDefaultAsFallback: false,
    alwaysUseDefault: false,
  });
  const _points = BigInt(points) * BigInt(10 ** 4);

  const fetch = async () => {
    if (!poolContract.address) return;
    const multicallResponse = await multicall({
      chainId,
      contracts: claimableTokens.map((tokenAddress) => ({
        address: poolContract.address!,
        abi: poolAbi,
        functionName: "calculate",
        args: [_points, tokenAddress],
      })),
    });

    // return just the results
    return multicallResponse.map((response) => response.result || 0n);
  };

  return useQuery(["claimCalculations", chainId, points], fetch, {
    enabled: Boolean(
      _points > 0 && poolContract.address && claimableTokens.length,
    ),
    // 1 minute
    cacheTime: 60_000,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
};
