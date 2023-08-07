import { useQuery } from "wagmi";
import { useGroupMerkleTree } from "./useGroupMerkleTree";

export const useGroupMerkleRoot = (
  proposalIds: string[],
  options?: { enabled: boolean },
) => {
  const tree = useGroupMerkleTree(proposalIds);

  return useQuery(
    ["group-merkle-root", proposalIds],
    () => tree!.getHexRoot(),
    {
      enabled: (options?.enabled ?? true) && !!tree,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );
};
