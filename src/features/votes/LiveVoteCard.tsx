import { twJoin, twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CheckMark } from "../common/icons/CheckMark";
import { Proposal } from "./hooks/useGroupedProposals";
import { useSnapshotProposalUrl } from "./hooks/useSnapshotUrl";
import { useUserVotes } from "./hooks/useUserVotes";

export const LiveVoteCard = ({ proposal }: { proposal: Proposal }) => {
  const { data: userVotes, isLoading: userVotesLoading } = useUserVotes();

  const hasStarted = proposal.start * 1000 < Date.now();
  const hasEnded = proposal.end * 1000 < Date.now();
  const hasUserVoted = Boolean(
    userVotes?.find((v) => v.proposal.id === proposal.id),
  );

  const proposalUrl = useSnapshotProposalUrl(proposal.id);
  const { isConnected: isWalletConnected } = useAccount();
  return (
    <a
      className="flex flex-row gap-5 ring-1 ring-gray-800 px-5 py-4 items-center rounded cursor-pointer"
      href={proposalUrl}
      target="_blank"
      rel="noreferrer"
    >
      {/* Status light */}
      {isWalletConnected && (
        <div
          className={twJoin([
            "w-3 h-3 rounded-full mx-1.5",
            hasStarted
              ? hasEnded
                ? "bg-red-600"
                : "bg-green-400"
              : "bg-yellow-500",
          ])}
        />
      )}

      {/* Proposal title */}
      <span
        className={twJoin(
          "flex-1 text-base font-bold",
          (hasUserVoted || hasEnded) && "text-gray-500",
        )}
      >
        {proposal.title}
      </span>

      {/* Status pill */}
      <div
        className={twJoin([
          "text-xs leading-6 uppercase font-bold px-4 py-1 rounded-full",
          "ring-1 ring-gray-800 flex flex-row gap-2 items-center",
          hasUserVoted && "text-font-secondary",
        ])}
      >
        {!hasEnded && hasUserVoted && (
          <span className={twJoin("text-green-400")}>
            <CheckMark />
          </span>
        )}
        <span className={twMerge(hasEnded && "text-gray-500")}>
          {hasEnded
            ? "Finalizing"
            : hasUserVoted
            ? "Voted"
            : hasStarted
            ? "Vote Now"
            : "Vote Pending"}
        </span>
      </div>
    </a>
  );
};
