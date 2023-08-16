import { format } from "@greypixel_/nicenumbers";
import { Fragment, useEffect } from "react";
import { MdChevronRight, MdClose, MdOpenInNew } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { Checkbox } from "../common/Checkbox";
import { CheckMark } from "../common/icons/CheckMark";
import { useGroupClaimStatus } from "./hooks/useGroupClaimStatus";
import { Proposal } from "./hooks/useGroupedProposals";
import { useEpochSelectionStore } from "./store/useEpochSelectionStore";
import { getEpochName } from "./utils/getEpochName";

export const PastEpochCard = ({
  proposalGroup,
  proposalGroupState,
}: {
  proposalGroup: Proposal[];
  proposalGroupState: ReturnType<typeof useGroupClaimStatus>;
}) => {
  const [setEpochSelected, selectedEpochs, setPointsClaimableForEpoch] =
    useEpochSelectionStore((state) => [
      state.setEpochSelected,
      state.selectedEpochs,
      state.setPointsClaimableForEpoch,
    ]);

  useEffect(() => {
    setPointsClaimableForEpoch(
      proposalGroup[0].id,
      proposalGroupState.pointsEarned,
    );
  }, [
    proposalGroup,
    proposalGroupState.pointsEarned,
    proposalGroupState.hasUserClaimed,
    setPointsClaimableForEpoch,
  ]);

  const { isConnected: isWalletConnected } = useAccount();
  const proposalGroupTitle = getEpochName(proposalGroup[0]) + " Epoch";
  return (
    <div
      className="grid border border-border-dark items-center"
      style={{ gridTemplateColumns: "auto 1fr auto auto" }}
    >
      {/* Checkbox */}
      <div className="p-5 justify-self-center flex">
        {!proposalGroupState.hasUserClaimed && (
          <Checkbox
            className={twJoin(!isWalletConnected && "invisible")}
            disabled={
              proposalGroupState.hasUserClaimed ||
              proposalGroupState.pointsEarned === 0
            }
            checked={selectedEpochs.includes(proposalGroup[0].id)}
            onCheckedChange={(newState) =>
              setEpochSelected(proposalGroup[0].id, newState as boolean)
            }
          />
        )}
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
