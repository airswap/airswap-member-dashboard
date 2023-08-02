import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CheckMark } from "../common/icons/CheckMark";
import { Proposal } from "./hooks/useGroupedProposals";

export const LiveVoteCard = ({
  proposal,
  hasStarted,
  hasUserVoted,
}: {
  proposal: Proposal;
  hasUserVoted: boolean;
  hasStarted: boolean;
}) => {
  const { isConnected: isWalletConnected } = useAccount();
  return (
    <div className="flex flex-row gap-4 ring-1 ring-border-dark px-6 py-5 items-center rounded">
      {/* Status light */}
      {isWalletConnected && (
        <div
          className={twJoin([
            "w-3 h-3 rounded-full",
            hasStarted ? "bg-accent-green" : "bg-accent-orange",
          ])}
        />
      )}

      {/* Proposal title */}
      <span
        className={twJoin(
          "flex-1 text-base font-bold",
          hasUserVoted && "text-font-secondary",
        )}
      >
        {proposal.title}
      </span>

      {/* Status pill */}
      <div
        className={twJoin([
          "text-xs leading-6 uppercase font-bold px-4 py-1 rounded-full",
          "ring-1 ring-border-dark flex flex-row gap-2 items-center",
          hasUserVoted && "text-font-secondary",
        ])}
      >
        {hasUserVoted && (
          <span className="text-accent-lightgreen">
            <CheckMark />
          </span>
        )}
        <span>
          {hasUserVoted ? "Voted" : hasStarted ? "Vote Now" : "Vote Pending"}
        </span>
      </div>
    </div>
  );
};
