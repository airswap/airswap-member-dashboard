import { twJoin, twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CheckMark } from "../common/icons/CheckMark";
import { Proposal } from "./hooks/useGroupedProposals";
import { useUserVotes } from "./hooks/useUserVotes";

export const LiveVoteCard = ({ proposal }: { proposal: Proposal }) => {
  const { data: userVotes, isLoading: userVotesLoading } = useUserVotes();

  const hasStarted = proposal.start * 1000 < Date.now();
  const hasEnded = proposal.end * 1000 < Date.now();
  const hasUserVoted = Boolean(
    userVotes?.find((v) => v.proposal.id === proposal.id),
  );

  const { isConnected: isWalletConnected } = useAccount();
  return (
    <div className="flex flex-row gap-4 ring-1 ring-border-dark px-6 py-5 items-center rounded">
      {/* Status light */}
      {isWalletConnected && (
        <div
          className={twJoin([
            "w-3 h-3 rounded-full",
            hasStarted
              ? hasEnded
                ? "bg-accent-red"
                : "bg-accent-green"
              : "bg-accent-orange",
          ])}
        />
      )}

      {/* Proposal title */}
      <span
        className={twJoin(
          "flex-1 text-base font-bold",
          // TODO: FIX color
          (hasUserVoted || hasEnded) && "text-zinc-500",
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
        {!hasEnded && hasUserVoted && (
          <span className={twJoin("text-accent-lightgreen")}>
            <CheckMark />
          </span>
        )}
        <span className={twMerge(hasEnded && "text-zinc-500")}>
          {hasEnded
            ? "Awaiting finalization"
            : hasUserVoted
            ? "Voted"
            : hasStarted
            ? "Vote Now"
            : "Vote Pending"}
        </span>
      </div>
    </div>
  );
};
