import { format } from "@greypixel_/nicenumbers";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CheckMark } from "../common/icons/CheckMark";
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

  let statusText = "Vote pending";
  let isComplete = false;
  if (hasStarted && !hasEnded) {
    if (!hasUserVoted) {
      statusText = "Vote now";
    } else {
      statusText = "Voted";
      isComplete = true;
    }
  } else if (hasEnded) {
    if (!hasUserVoted) {
      statusText = "";
    } else if (hasUserClaimed) {
      statusText = `${format(pointsEarned, {
        tokenDecimals: 0,
      })} points claimed`;
      isComplete = true;
    } else {
      statusText = `${format(pointsEarned, { tokenDecimals: 0 })} points`;
    }
  }

  return (
    <div className="flex flex-row gap-4 ring-1 ring-border-dark px-6 py-5 items-center rounded">
      {/* Status light */}
      {isWalletConnected && !hasEnded && (
        <div
          className={twJoin([
            "w-3 h-3 rounded-full",
            hasStarted ? "bg-accent-green" : "bg-accent-orange",
          ])}
        />
      )}

      {/* Proposal title */}
      <span className="flex-1 text-base font-bold">{proposal.title}</span>

      {/* Status pill */}
      <div
        className={twJoin([
          "text-sm leading-6 uppercase font-bold px-4 py-1 rounded-full",
          "ring-1 ring-border-dark flex flex-row gap-2 items-center",
          isComplete && "text-font-secondary",
        ])}
      >
        {isComplete && (
          <span className="text-accent-lightgreen">
            <CheckMark />
          </span>
        )}
        <span>{statusText}</span>
      </div>
    </div>
  );
};

export const VoteList = ({}: {}) => {
  const { data: proposals } = useProposals();

  const liveProposals = proposals?.filter(
    (proposal) => proposal.end * 1000 > Date.now(),
  );
  const pastProposals = proposals?.filter(
    (proposal) => proposal.end * 1000 < Date.now(),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Live Votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      {liveProposals?.map((proposal) => (
        <ProposalListItem proposal={proposal} />
      ))}

      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Past Votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      {pastProposals?.map((proposal) => (
        <ProposalListItem proposal={proposal} />
      ))}
    </div>
  );
};
