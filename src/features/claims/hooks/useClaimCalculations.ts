import { BigNumber } from "bignumber.js";
import { hashMessage } from "viem";
import { useNetwork, useQuery } from "wagmi";
import { multicall } from "wagmi/actions";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { poolAbi } from "../../../contracts/poolAbi";

export const useClaimCalculations = (
  points: number,
  claimableTokens: `0x${string}`[],
  enabled: boolean = true,
) => {
  const { chain } = useNetwork();
  const [poolContract] = useContractAddresses([ContractTypes.AirSwapPool], {
    useDefaultAsFallback: false,
    alwaysUseDefault: false,
  });
  const _points = BigInt(
    new BigNumber(points)
      .multipliedBy(10 ** 4)
      .toFixed(0, BigNumber.ROUND_FLOOR),
  );

  const fetch = async () => {
    if (!poolContract.address) return;
    const multicallResponse = await multicall({
      chainId: chain!.id,
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

  const claimableTokenAddressesHash = hashMessage(claimableTokens.join(","));

  return useQuery(
    ["claimCalculations", chain!.id, claimableTokenAddressesHash, points],
    fetch,
    {
      enabled: Boolean(
        enabled &&
          _points > 0 &&
          poolContract.address &&
          claimableTokens.length &&
          chain,
      ),
      // 1 minute
      cacheTime: 60_000,
      staleTime: 30_000,
      refetchInterval: 30_000,
    },
  );
};
