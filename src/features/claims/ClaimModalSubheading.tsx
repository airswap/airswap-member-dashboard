import { useEffect, useState } from "react";
import { formatNumber } from "../common/utils/formatNumber";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";

export const ClaimModalSubheading = ({}: {}) => {
  const [points, setPoints] = useState<{ total: number; selected: number }>();
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

  // Prevent title from updating when the modal is open
  useEffect(() => {
    if (points) return;
    setPoints({
      total: totalPointsClaimable,
      selected: pointsSelected,
    });
  }, [totalPointsClaimable, pointsSelected, points]);

  return (
    <span>
      Using {formatNumber(points?.selected)} out of{" "}
      {formatNumber(points?.total)} points
    </span>
  );
};
