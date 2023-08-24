// FIXME: this should not be the source - probably a json file instead,

import { useEpochSelectionStore } from "../votes/store/useEpochSelectionStore";
import { ClaimableTokensLineItem } from "./ClaimableTokensLineItem";

// with goerli and mainnet.
const stakerTokens: `0x${string}`[] = [
  "0x326c977e6efc84e512bb9c30f76e30c160ed06fb", // link
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // uni
  "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6", // weth
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
