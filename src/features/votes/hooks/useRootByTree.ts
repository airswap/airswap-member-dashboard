import { useContractRead } from "wagmi";
import { AirSwapPoolAbi } from "../../../abi/AirSwapPool";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";

export const useRootByTree = ({
  treeId,
  enabled,
}: {
  treeId?: `0x${string}`;
  enabled?: boolean;
}) => {
  const [poolContract] = useContractAddresses([ContractTypes.AirSwapPool], {
    defaultChainId: 1,
    alwaysUseDefault: false,
    useDefaultAsFallback: true,
  });

  return useContractRead({
    address: poolContract.address,
    chainId: poolContract.chainId,
    abi: AirSwapPoolAbi,
    functionName: "rootsByTree",
    args: [treeId!],
    enabled: !!treeId && (enabled ?? true),
    cacheTime: 3_600_000,
  });
};
