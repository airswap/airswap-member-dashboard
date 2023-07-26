import { useMemo } from "react";
import { generateMerkleLeaf } from "../utils/merkleUtils";
import { useProposalMerkleTree } from "./useProposalMerkleTree";

export const useProposalMerkleProof = (
  proposalId: string,
  vote: {
    voter: `0x${string}`;
    vp: number;
  },
) => {
  const tree = useProposalMerkleTree(proposalId);

  return useMemo(() => {
    if (!tree) return;
    const leaf = generateMerkleLeaf(vote);
    return tree.getProof(leaf);
  }, [tree, vote]);
};
