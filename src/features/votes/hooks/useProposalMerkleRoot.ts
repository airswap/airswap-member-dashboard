import BigNumber from "bignumber.js";
import MerkleTree from "merkletreejs";
import { useMemo } from "react";
import { encodePacked, keccak256 } from "viem";
import { useProposalVotes } from "./useProposalVotes";

export const useProposalMerkleRoot = (proposalId: string) => {
  const { data: votes } = useProposalVotes(proposalId);
  return useMemo(() => {
    if (!votes) return;
    const leaves = votes.map((vote) =>
      encodePacked(
        ["address", "uint256"],
        [
          vote.voter,
          BigInt(
            new BigNumber(vote.vp)
              .multipliedBy(10 ** 4)
              .toFixed(0, BigNumber.ROUND_FLOOR),
          ),
        ],
      ),
    );

    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const root = merkleTree.getHexRoot();
    return root;
  }, [votes]);
};
