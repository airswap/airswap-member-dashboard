import { format } from "@greypixel_/nicenumbers";
import { useEffect } from "react";
import { MdClose, MdOpenInNew } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { Accordion } from "../common/Accordion";
import { Checkbox } from "../common/Checkbox";
import { CheckMark } from "../common/icons/CheckMark";
import { useGroupClaimStatus } from "./hooks/useGroupClaimStatus";
import { useGroupHash } from "./hooks/useGroupHash";
import { Proposal } from "./hooks/useGroupedProposals";
import { useTreeRoots } from "./hooks/useTreeRoots";
import { useEpochSelectionStore } from "./store/useEpochSelectionStore";
import { getEpochName } from "./utils/getEpochName";

const SNAPSHOT_WEB = import.meta.env.VITE_SNAPSHOT_WEB;
const SNAPSHOT_SPACE = import.meta.env.VITE_SNAPSHOT_SPACE;

export const PastEpochCard = ({
  proposalGroup,
}: {
  proposalGroup: Proposal[];
}) => {
  const [setEpochSelected, selectedEpochs, setPointsClaimableForEpoch] =
    useEpochSelectionStore((state) => [
      state.setEpochSelected,
      state.selectedEpochs,
      state.setPointsClaimableForEpoch,
    ]);

  const { pointsEarned, hasUserClaimed, votedForProposal } =
    useGroupClaimStatus({
      proposalGroup,
    });

  const treeId = useGroupHash(proposalGroup);
  const [{ data: root }] = useTreeRoots({
    treeIds: [treeId],
  });

  useEffect(() => {
    if (root) {
      setPointsClaimableForEpoch(proposalGroup[0].id, pointsEarned);
    }
  }, [
    proposalGroup,
    pointsEarned,
    hasUserClaimed,
    setPointsClaimableForEpoch,
    root,
  ]);

  const { isConnected: isWalletConnected } = useAccount();

  const proposalGroupTitle = getEpochName(proposalGroup[0]) + " Epoch";

  const trigger = (
    <div className="flex w-full items-center justify-between pr-4 font-semibold">
      {/* Checkbox and title. */}
      <div className="flex items-center">
        {/* Checkbox */}
        <div className="align-center -mt-1 ml-0.5 mr-4 items-center ">
          {!hasUserClaimed && (
            <Checkbox
              className={twJoin(!isWalletConnected && "invisible")}
              disabled={
                !root || // disabled if there's no root
                hasUserClaimed || // or if the user has already claimed
                pointsEarned === 0 // or if there are no points to claim
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
      </div>

      {/* Points */}
      <div
        className={twJoin([
          "rounded-full px-4 py-1 text-xs font-bold uppercase leading-6",
          "flex flex-row items-center gap-2 ring-1 ring-border-dark",
          hasUserClaimed && "text-font-secondary",
        ])}
      >
        {/* TODO: small numbers of points probably don't need decimals. */}
        {format(pointsEarned, {
          tokenDecimals: 0,
          significantFigures: 3,
          minDecimalPlaces: 0,
        })}
        &nbsp; Points
      </div>
    </div>
  );

  const content = proposalGroup.map((proposal, i) => (
    <div
      className={twJoin([
        "grid grid-cols-[auto,1fr,auto,auto]",
        "items-center border border-border-dark",
      ])}
      key={proposal.id}
    >
      <div className="justify-self-center p-4">
        {votedForProposal[i] ? (
          <span className="text-accent-lightgreen">
            <CheckMark size={20} />
          </span>
        ) : (
          <span className="text-accent-lightred">
            <MdClose size={20} />
          </span>
        )}
      </div>
      <div className="text-font-secondary text-sm font-medium">
        {proposal.title}
      </div>
      <div></div>
      <div className="self-end justify-self-center p-5">
        <a
          href={`${SNAPSHOT_WEB}#/${SNAPSHOT_SPACE}/proposal/${proposal.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <MdOpenInNew size={16} />
        </a>
      </div>
    </div>
  ));

  return (
    <Accordion
      rootStyles="w-full items-center border border-border-dark rounded"
      trigger={trigger}
      itemId={treeId}
      content={content}
    />
  );
};
