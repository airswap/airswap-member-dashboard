import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePublicClient } from "wagmi";
import { ContractTypes } from "../../../config/ContractAddresses";
import { useContractAddresses } from "../../../config/hooks/useContractAddress";
import { poolAbi } from "../../../contracts/poolAbi";
import { getGroupHash } from "../utils/getGroupHash";

const EMPTY_ROOT =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Gets the root for the given tree id.
 * @returns The root, or null if the tree id is not set.
 */
export const useTreeRoots = ({
  treeIds,
  proposalIds,
  enabled,
}: {
  // Common props.
  enabled?: boolean;
} & ( // treeIds OR proposalIds and not both. // This discriminated union means the hook can only be called with either
  | {
      treeIds?: `0x${string}`[];
      proposalIds?: undefined;
    }
  | {
      treeIds?: undefined;
      proposalIds?: string[][];
    }
)) => {
  const [poolContract] = useContractAddresses([ContractTypes.AirSwapPool], {
    defaultChainId: 1,
    alwaysUseDefault: false,
    useDefaultAsFallback: true,
  });

  const client = usePublicClient({
    chainId: poolContract.chainId,
  });

  const fetch = async (treeId: `0x${string}`) => {
    const root = await client.readContract({
      address: poolContract.address!,
      abi: poolAbi,
      functionName: "rootsByTree",
      args: [treeId],
    });
    return root === EMPTY_ROOT ? null : root;
  };

  const _treeIds = useMemo(
    () => treeIds || proposalIds?.map(getGroupHash),
    // Ignored becaus using stringified version.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [treeIds, JSON.stringify(proposalIds)],
  );

  return useQueries({
    queries: (_treeIds || []).map((id) => ({
      queryKey: [poolContract.chainId, poolContract.address, "rootsByTree", id],
      queryFn: () => fetch(id!),
      cacheTime: 60_000,
      staleTime: 60_000,
      enabled: !!id && !!poolContract.address && (enabled ?? true),
    })),
  });
};
