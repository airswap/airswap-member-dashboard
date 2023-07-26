import { useMemo } from "react";
import { useProposalMerkleTree } from "./useProposalMerkleTree";

export const useProposalMerkleRoot = (proposalId: string) => {
  const tree = useProposalMerkleTree(proposalId);

  return useMemo(() => {
    if (!tree) return;
    return tree.getHexRoot();
  }, [tree]);
};
