import { Fragment } from "react";
import { MdClose, MdOpenInNew } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { CheckMark } from "../common/icons/CheckMark";
import { useGroupClaimStatus } from "./hooks/useGroupClaimStatus";
import { Proposal } from "./hooks/useGroupedProposals";
import { getEpochName } from "./utils/getEpochName";
import AccordionComponent from "../common/Accordion";
import { format } from "@greypixel_/nicenumbers";

export const PastEpochCard = ({
  proposalGroup,
  proposalGroupState,
}: {
  proposalGroup: Proposal[];
  proposalGroupState: ReturnType<typeof useGroupClaimStatus>;
}) => {
  const proposalGroupTitle = getEpochName(proposalGroup[0]) + " Epoch";

  const pointsPillTrigger = (
    <div
      className={twJoin([
        "rounded-full px-4 py-1 text-xs font-bold uppercase leading-6",
        "flex flex-row items-center gap-2 ring-1 ring-border-dark",
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
  );

  const content = proposalGroup.map((proposal, i) => (
    <Fragment key={proposal.id}>
      <div className="col-span-full h-px"></div>

      <div className="justify-self-center p-5">
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
      <div className="text-font-secondary text-sm font-medium">
        {proposal.title}
      </div>
      <div></div>
      <div className="self-end justify-self-center p-5">
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
  ));

  return (
    <AccordionComponent
      rootStyles={["w-full items-center border border-border-dark p-2"]}
      triggerTitle={proposalGroupTitle}
      pointsPill={pointsPillTrigger}
      itemId={"1"}
      content={content}
    />
  );
};
