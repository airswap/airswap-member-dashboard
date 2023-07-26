import { useAccount } from "wagmi";
import { useProposalMerkleRoot } from "./useProposalMerkleRoot";
import { Proposal, useProposals } from "./useProposals";
import { useUserVotes } from "./useUserVotes";

export const useProposalClaimStatus = ({
  proposal,
  voterAddress: _voterAddress,
}: {
  proposal: Proposal;
  /**
   * defaults to connected account
   */
  voterAddress?: `0x${string}`;
}) => {
  const { address: connectedAccount } = useAccount();
  const address = _voterAddress || connectedAccount;

  // Fetch all user votes.
  const { data: userVotes } = useUserVotes(_voterAddress);

  // We need to know how many simulataneous proposals there are to reduce points
  const { data: proposals } = useProposals();
  const numSimultaneous = proposals?.filter(
    (p) => p.start === proposal.start && p.end === proposal.end,
  ).length;

  // Determine if the user has voted for this proposal or not:
  const vote = userVotes?.find((vote) => vote.proposal.id === proposal.id);
  const hasUserVoted = !!vote;

  // Determine if proposal has ended
  const hasEnded = proposal.end * 1000 < Date.now();
  const hasStarted = proposal.start * 1000 < Date.now();

  // If the user has voted, check if they've claimed. We need the root for this.
  const root = useProposalMerkleRoot(proposal.id, {
    enabled: hasUserVoted || false, // note that we don't compute root 'til we know user has voted.
  });

  // TODO: this can be a useContractRead
  const isRootEnabled: boolean | undefined = false; //

  const hasUserClaimed: boolean | undefined = false; //

  const pointsEarned = hasUserVoted ? vote.vp / (numSimultaneous || 1) : 0;

  return {
    hasStarted,
    hasEnded,
    hasUserVoted,
    pointsEarned,
    isRootEnabled,
    hasUserClaimed,
  };
};
