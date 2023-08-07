import { LiveVoteCard } from "./LiveVoteCard";
import { PastEpochCard } from "./PastEpochCard";
import { useGroupClaimStatus } from "./hooks/useGroupClaimStatus";
import { Proposal } from "./hooks/useGroupedProposals";

export const VoteListItem = ({
  proposalGroup,
}: {
  proposalGroup: Proposal[];
}) => {
  const proposalGroupState = useGroupClaimStatus({
    proposalGroup,
  });

  const isLiveEpoch = !proposalGroupState.hasEnded;

  if (isLiveEpoch) {
    return proposalGroup.map((proposal, i) => {
      const hasVoted = proposalGroupState.votedForProposal[i];
      return (
        <LiveVoteCard
          hasUserVoted={hasVoted}
          proposal={proposal}
          hasStarted={proposalGroupState.hasStarted}
          key={proposal.id}
        />
      );
    });
  } else {
    return (
      <PastEpochCard
        proposalGroupState={proposalGroupState}
        proposalGroup={proposalGroup}
      />
    );
  }
};
