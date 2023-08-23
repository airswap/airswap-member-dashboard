import { useQuery } from "wagmi";
import { useGroupMerkleTree } from "./useGroupMerkleTree";

export const useGroupMerkleRoot = (
  proposalIds: string[],
  options?: { enabled: boolean },
) => {
  const tree = useGroupMerkleTree(proposalIds, {
    enabled: options?.enabled ?? true,
  });

  return useQuery(
    ["group-merkle-root", proposalIds],
    () => tree!.getHexRoot() as `0x${string}`,
    {
      enabled: (options?.enabled ?? true) && !!tree,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );
};
