import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";

export const ClaimModalSubheading = ({}: {}) => {
  const [pointsClaimableByEpoch, allClaims, selectedClaims] =
    useClaimSelectionStore((state) => [
      state.pointsClaimableByEpoch,
      state.allClaims,
      state.selectedClaims,
      state.clearSelectedClaims,
      state.setShowClaimModal,
    ]);
  const _selectedClaims = selectedClaims.length ? selectedClaims : allClaims;
  const totalPointsClaimable = Object.values(pointsClaimableByEpoch).reduce(
    (acc, epoch) => acc + epoch,
    0,
  );

  const pointsSelected = _selectedClaims.reduce(
    (acc, { value }) => acc + value,
    0,
  );

  return (
    <span>
      Using {pointsSelected} out of {totalPointsClaimable} points
    </span>
  );
};
