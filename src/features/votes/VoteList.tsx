import { format } from "@greypixel_/nicenumbers";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useProposalClaimStatus } from "./hooks/useProposalClaimStatus";
import { Proposal, useProposals } from "./hooks/useProposals";

const ProposalListItem = ({ proposal }: { proposal: Proposal }) => {
  const { isConnected: isWalletConnected } = useAccount();

  const {
    hasEnded,
    hasStarted,
    hasUserVoted,
    hasUserClaimed,
    isRootEnabled,
    pointsEarned,
  } = useProposalClaimStatus({
    proposal,
  });

  return (
    <div className="flex flex-row gap-4 border border-border-dark px-6 py-5">
      {isWalletConnected && !hasEnded && (
        <div
          className={twJoin([
            "w-3 h-3",
            hasStarted ? "bg-accent-green" : "bg-accent-orange",
          ])}
        />
      )}
      <span className="flex-1">{proposal.title}</span>
      {hasUserVoted ? (
        <span>
          {format(pointsEarned, { tokenDecimals: 0 })} points{" "}
          {hasUserClaimed && "claimed"}
        </span>
      ) : (
        <span className="text-xs text-accent-orange">Didn't vote</span>
      )}
    </div>
  );
};

export const VoteList = ({}: {}) => {
  const { data: proposals } = useProposals();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Live Votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>

      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Past Votes</h3>
      </div>
      <div className="h-px flex-1 bg-border-dark">
        {proposals?.map((proposal) => <ProposalListItem proposal={proposal} />)}
      </div>
    </div>
  );
};
