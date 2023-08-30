import { useMemo } from "react";
import { useAccount } from "wagmi";
import { Proposal } from "./useGroupedProposals";
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
  const address = _voterAddress || connectedAccount;

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

    // TODO: this will be from a contractRead
    const isRootSet: boolean | undefined = false;

    // TODO: this will be from a contractRead
    const hasUserClaimed: boolean | undefined = false;

    const totalVps = vpsByVote.reduce((acc: number, vp) => acc + (vp || 0), 0);
    const pointsEarned = totalVps / proposalGroup.length;

    return {
      votedForProposal,
      votedOnAllProposals,
      hasEnded,
      hasStarted,
      isRootSet,
      hasUserClaimed,
      pointsEarned,
    };
  }, [userVotes, proposalGroup]);
};
