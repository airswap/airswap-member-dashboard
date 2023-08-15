import { format } from "@greypixel_/nicenumbers";
import { Fragment } from "react";
import { MdChevronRight, MdClose, MdOpenInNew } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { Checkbox } from "../common/Checkbox";
import { CheckMark } from "../common/icons/CheckMark";
import { useGroupClaimStatus } from "./hooks/useGroupClaimStatus";
import { Proposal } from "./hooks/useGroupedProposals";
import { getEpochName } from "./utils/getEpochName";
import AccordionComponent from "../common/Accordion";

export const PastEpochCard = ({
  proposalGroup,
  proposalGroupState,
}: {
  proposalGroup: Proposal[];
  proposalGroupState: ReturnType<typeof useGroupClaimStatus>;
}) => {
  const { isConnected: isWalletConnected } = useAccount();
  const proposalGroupTitle = getEpochName(proposalGroup[0]) + " Epoch";

  const proposalTrigger = (
    <>
      {/* <Checkbox */}
      <div className="flex justify-self-center p-5">
        {!proposalGroupState.hasUserClaimed && (
          <Checkbox
            className={twJoin(!isWalletConnected && "invisible")}
            disabled={
              proposalGroupState.hasUserClaimed ||
              proposalGroupState.pointsEarned === 0
            }
          />
        )}
      </div>
      {/* Title */}
      <div className="font-bold">{proposalGroupTitle}</div>
      {/* Points pill */}
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
      {/* Accordion collapse */}
      <button className="p-5">
        <MdChevronRight size={32} className={"-rotate-90"} />
      </button>
    </>
  );

  const items = () => {
    {
      /* Proposal list */
    }
    return proposalGroup.map((proposal, i) => (
      <Fragment key={proposal.id}>
        <div className="col-span-full h-px bg-border-dark"></div>

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
  };
  const proposalItems = items();

  return (
    <>
      <div
        className="grid grid-cols-[auto,1fr,auto,auto] items-center border border-border-dark"
        style={{ gridTemplateColumns: "auto 1fr auto auto" }}
      >
        <AccordionComponent
          items={proposalGroup}
          trigger={proposalTrigger}
          content={proposalItems}
        />

        {/* proposalTrigger was moved from here and refactored above */}

        {/* items function replaced code block here */}
      </div>
      {/* </AccordionComponent> */}
    </>
  );
};
