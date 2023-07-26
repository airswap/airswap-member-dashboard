import { useQuery } from "wagmi";
import { useProposalMerkleTree } from "./useProposalMerkleTree";

export const useProposalMerkleRoot = (
  proposalId: string,
  options?: { enabled: boolean },
) => {
  const tree = useProposalMerkleTree(proposalId);

  return useQuery(
    ["proposal-merkle-root", proposalId],
    () => tree!.getHexRoot(),
    {
      enabled: (options?.enabled ?? true) && !!tree,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );
};
