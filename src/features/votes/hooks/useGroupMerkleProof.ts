import { useMemo } from "react";
import { generateMerkleLeaf } from "../utils/merkleUtils";
import { useGroupMerkleTree } from "./useGroupMerkleTree";

export const useGroupMerkleProof = (
  proposalIds: string[],
  vote: {
    voter: `0x${string}`;
    vp: number;
  },
) => {
  const tree = useGroupMerkleTree(proposalIds);

  return useMemo(() => {
    if (!tree) return;
    const leaf = generateMerkleLeaf(vote);
    return tree.getProof(leaf);
  }, [tree, vote]);
};
