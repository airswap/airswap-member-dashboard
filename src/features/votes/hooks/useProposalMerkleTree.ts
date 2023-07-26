import MerkleTree from "merkletreejs";
import { useMemo } from "react";
import { keccak256 } from "viem";
import { generateMerkleLeaf } from "../utils/merkleUtils";
import { useProposalVotes } from "./useProposalVotes";

export const useProposalMerkleTree = (proposalId: string) => {
  const { data: votes } = useProposalVotes(proposalId);
  return useMemo(() => {
    if (!votes) return;
    const leaves = votes.map(generateMerkleLeaf);
    return new MerkleTree(leaves, keccak256, { sort: true });
  }, [votes]);
};
