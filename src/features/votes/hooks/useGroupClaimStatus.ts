import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useGroupHash } from "./useGroupHash";
import { Proposal } from "./useGroupedProposals";
import { useHasClaimedForTree } from "./useHasClaimedForTree";
import { useUserVotes } from "./useUserVotes";

export const useGroupClaimStatus = ({
  proposalGroup,
  voterAddress: _voterAddress,
}: {
  proposalGroup: Proposal[];
  /**
   * defaults to connected account
   */
  voterAddress?: `0x${string}`;
}) => {
  const { address: connectedAccount } = useAccount();
  const groupHash = useGroupHash(proposalGroup);
  const address = _voterAddress || connectedAccount;
  const { data: hasClaimed, isLoading: claimStatusLoading } =
    useHasClaimedForTree({
      voterAddress: address,
      treeId: groupHash,
    });

  // Fetch all user votes.
  const { data: userVotes } = useUserVotes(address);

  return useMemo(() => {
    const vpsByVote = proposalGroup.map(
      (proposal) =>
        userVotes?.find((vote) => vote.proposal.id === proposal.id)?.vp || null,
    );
    const votedForProposal = vpsByVote.map((v) => v !== null);
    const votedOnAllProposals = votedForProposal.every((v) => v);

    // Determine if proposal has ended
    const hasEnded = proposalGroup[0].end * 1000 < Date.now();
    const hasStarted = proposalGroup[0].start * 1000 < Date.now();

    const totalVps = vpsByVote.reduce((acc: number, vp) => acc + (vp || 0), 0);
    const pointsEarned = votedOnAllProposals
      ? totalVps / proposalGroup.length
      : 0;

    return {
      votedForProposal,
      votedOnAllProposals,
      hasEnded,
      hasStarted,
      hasUserClaimed: hasClaimed,
      claimStatusLoading,
      pointsEarned,
      treeId: groupHash,
    };
  }, [userVotes, proposalGroup, hasClaimed, claimStatusLoading, groupHash]);
};
