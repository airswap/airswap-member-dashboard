import { format } from "@greypixel_/nicenumbers";
import { Fragment } from "react";
import { MdChevronRight, MdClose, MdOpenInNew } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CheckMark } from "../common/icons/CheckMark";
import { useGroupClaimStatus } from "./hooks/useGroupClaimStatus";
import { Proposal, useGroupedProposals } from "./hooks/useGroupedProposals";

/** This function ensures that the epoch month is based off the UTC month
 * in which the vote was made. It prevents a starting on 1st Month in the
 * morning in UTC being referred to as the previous month in the far west
 * (e.g. Hawaii).
 */
function getEpochName(proposal: Proposal) {
  const startAsDate = new Date(proposal.start * 1000);
  // Set the month of the local date to the UTC month
  startAsDate.setMonth(startAsDate.getUTCMonth());
  startAsDate.setFullYear(startAsDate.getUTCFullYear());
  // Return just the month.
  return startAsDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}

const LiveVoteCard = ({
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

const PastEpochCard = ({
  proposalGroup,
  proposalGroupState,
}: {
  proposalGroup: Proposal[];
  proposalGroupState: ReturnType<typeof useGroupClaimStatus>;
}) => {
  const proposalGroupTitle = getEpochName(proposalGroup[0]) + " Epoch";
  return (
    <div
      className="grid border border-border-dark items-center"
      style={{ gridTemplateColumns: "auto 1fr auto auto" }}
    >
      {/* Checkbox */}
      <div className="p-5 justify-self-center">
        {!proposalGroupState.hasUserClaimed && <input type="checkbox" />}
      </div>

      {/* Title */}
      <div className="font-bold">{proposalGroupTitle}</div>

      {/* Points pill */}
      <div
        className={twJoin([
          "text-xs leading-6 uppercase font-bold px-4 py-1 rounded-full",
          "ring-1 ring-border-dark flex flex-row gap-2 items-center",
          proposalGroupState.hasUserClaimed && "text-font-secondary",
        ])}
      >
        {format(proposalGroupState.pointsEarned, {
          tokenDecimals: 0,
          significantFigures: 3,
          minDecimalPlaces: 0,
        })}
        &nbsp; Points
      </div>

      {/* Accordion collapse */}
      <button className="p-5">
        <MdChevronRight size={32} className={"-rotate-90"} />
      </button>

      {/* Proposal list */}
      {proposalGroup.map((proposal, i) => (
        <Fragment key={proposal.id}>
          <div className="col-span-full h-px bg-border-dark"></div>

          <div className="p-5 justify-self-center">
            {proposalGroupState.votedForProposal[i] ? (
              <span className="text-accent-lightgreen">
                <CheckMark />
              </span>
            ) : (
              // FIXME: THIS WAS NOT DONE TO DESIGN SPEC - DESIGN DIDN'T EXIST.
              <span className="text-accent-lightred">
                <MdClose />
              </span>
            )}
          </div>
          <div className="font-medium text-font-secondary text-sm">
            {proposal.title}
          </div>
          <div></div>
          <div className="p-5 justify-self-center self-end">
            <a
              href={`${import.meta.env.VITE_SNAPSHOT_WEB}#/${
                import.meta.env.VITE_SNAPSHOT_SPACE
              }/proposal/${proposal.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <MdOpenInNew size={16} />
            </a>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

const ProposalListItem = ({ proposalGroup }: { proposalGroup: Proposal[] }) => {
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

export const VoteList = ({}: {}) => {
  const { data: proposalGroups } = useGroupedProposals();

  // Note that all proposals have the same start and end, so if the first one
  // in the group is live, they all are.
  const liveProposalGroups = proposalGroups?.filter(
    (proposals) => proposals[0].end * 1000 > Date.now(),
  );

  const pastProposalGroups = proposalGroups?.filter(
    (proposals) => proposals[0].end * 1000 < Date.now(),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Live votes</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      {liveProposalGroups?.map((group) => (
        <ProposalListItem proposalGroup={group} key={group[0].id} />
      ))}

      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase">Past Epochs</h3>
        <div className="h-px flex-1 bg-border-dark"></div>
      </div>
      <div className="flex flex-col gap-9">
        {pastProposalGroups?.map((group) => (
          <ProposalListItem proposalGroup={group} key={group[0].id} />
        ))}
      </div>
    </div>
  );
};
