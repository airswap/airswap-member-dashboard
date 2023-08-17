// FIXME: this should not be the source - probably a json file instead,

import { useEpochSelectionStore } from "../votes/store/useEpochSelectionStore";
import { ClaimableTokensLineItem } from "./ClaimableTokensLineItem";

// with goerli and mainnet.
const stakerTokens: `0x${string}`[] = [
  "0x1a1ec25DC08e98e5E93F1104B5e5cdD298707d31",
  "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  "0x2899a03ffDab5C90BADc5920b4f53B0884EB13cC",
];

export const ClaimForm = ({}: {}) => {
  const [pointsClaimableByEpoch, selectedEpochs] = useEpochSelectionStore(
    (state) => [state.pointsClaimableByEpoch, state.selectedEpochs],
  );

  const totalPointsClaimable = Object.values(pointsClaimableByEpoch).reduce(
    (acc, epoch) => acc + epoch,
    0,
  );

  const pointsSelected = selectedEpochs.length
    ? selectedEpochs.reduce(
        (acc, epoch) => acc + pointsClaimableByEpoch[epoch],
        0,
      )
    : totalPointsClaimable;

  return (
    <div className="flex flex-col">
      <h2>Claim</h2>
      <h3>
        Using {pointsSelected} out of {totalPointsClaimable} points
      </h3>

      {stakerTokens.map((stakerToken) => (
        <ClaimableTokensLineItem
          numPoints={pointsSelected}
          tokenAddress={stakerToken}
          key={stakerToken}
        />
      ))}
    </div>
  );
};
