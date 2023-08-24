import { useAccount, useContractRead } from "wagmi";
import { AirSwapPoolAbi } from "../../../abi/AirSwapPool";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";

export const useHasClaimedForTree = ({
  treeId,
  voterAddress,
}: {
  treeId: `0x${string}`;
  voterAddress?: `0x${string}`;
}) => {
  const { address: connectedAccount } = useAccount();
  const _voterAddress = voterAddress || connectedAccount;
  const [airswapPool] = useContractAddresses([ContractTypes.AirSwapPool], {
    defaultChainId: 1,
    useDefaultAsFallback: true,
  });

  return useContractRead({
    ...airswapPool,
    abi: AirSwapPoolAbi,
    functionName: "claimed",
    args: [treeId, _voterAddress!],
    enabled: !!voterAddress,
    // 7 days
    cacheTime: 604_800_000,
    staleTime: 604_800_000,
  });
};
