import { useQuery, useQueryClient } from "wagmi";
import { useGroupMerkleTree } from "./useGroupMerkleTree";

export const useGroupMerkleRoot = (
  proposalIds: string[],
  options?: { enabled: boolean },
) => {
  const queryKey = ["group-merkle-root", proposalIds];
  const queryClient = useQueryClient();

  // Prevent fetching the merkle tree (lots of data) if we already have the root.
  const cachedRoot = queryClient.getQueryData(queryKey);

  const tree = useGroupMerkleTree(proposalIds, {
    enabled: !cachedRoot && (options?.enabled ?? true),
  });

  return useQuery(queryKey, () => tree!.getHexRoot() as `0x${string}`, {
    enabled: (options?.enabled ?? true) && !!tree,
    cacheTime: 5_184_000_000, // 2 months.
    staleTime: Infinity, // doesn't change
  });
};
