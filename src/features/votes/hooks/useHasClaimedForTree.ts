import { useAccount, useContractRead } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { poolAbi } from "../../../contracts/poolAbi";

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
    abi: poolAbi,
    functionName: "claimed",
    args: [treeId, _voterAddress!],
    enabled: !!voterAddress,
    // 7 days
    cacheTime: 604_800_000,
    staleTime: 604_800_000,
  });
};
