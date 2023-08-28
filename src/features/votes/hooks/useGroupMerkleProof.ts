import { useMemo } from "react";
import { generateMerkleLeaf } from "../utils/merkleUtils";
import { useGroupMerkleTree } from "./useGroupMerkleTree";

export const useGroupMerkleProof = ({
  proposalIds,
  vote,
  enabled,
}: {
  proposalIds: string[];
  vote: {
    voter: `0x${string}`;
    vp: number;
  };
  enabled?: boolean;
}) => {
  const tree = useGroupMerkleTree(proposalIds, { enabled: enabled ?? true });

  return useMemo(() => {
    if (!tree) return;
    const leaf = generateMerkleLeaf(vote);
    return tree.getHexProof(leaf) as `0x${string}`[];
  }, [tree, vote]);
};
