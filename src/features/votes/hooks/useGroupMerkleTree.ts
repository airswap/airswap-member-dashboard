import MerkleTree from "merkletreejs";
import { useMemo } from "react";
import { keccak256 } from "viem";
import { generateMerkleLeaf } from "../utils/merkleUtils";
import { useProposalGroupVotes } from "./useProposalGroupVotes";

export const useGroupMerkleTree = (proposalIds: string[]) => {
  const { data: votes } = useProposalGroupVotes(proposalIds);

  return useMemo(() => {
    if (!votes) return;

    // Get a list of voters and vps for each proposal, including only
    // voters who voted on every proposal in the group.
    const dataByUser: Record<
      `0x${string}`,
      {
        totalPoints: number;
        totalVotesCast: number;
        address: `0x${string}`;
      }
    > = {};

    for (const vote of votes) {
      const { voter, vp } = vote;
      if (!dataByUser[voter]) {
        // First vote we've recorded for this user in this group.
        dataByUser[voter] = {
          totalPoints: vp,
          totalVotesCast: 1,
          address: voter,
        };
      } else {
        dataByUser[voter].totalPoints += vp;
        dataByUser[voter].totalVotesCast += 1;
      }
    }

    const qualifyingVoters = Object.values(dataByUser)
      // filter out anyone who didn't vote on all of the proposals.
      .filter((userData) => userData.totalVotesCast === proposalIds.length)
      .map((userData) => ({
        vp: userData.totalPoints / proposalIds.length, // average vote weight
        voter: userData.address,
      }));

    const leaves = qualifyingVoters.map(generateMerkleLeaf);
    return new MerkleTree(leaves, keccak256, { sort: true });
  }, [votes, proposalIds.length]);
};
