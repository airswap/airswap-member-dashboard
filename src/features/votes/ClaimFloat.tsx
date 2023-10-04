import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { twJoin } from "tailwind-merge";
import { useAccount } from "wagmi";
import { Button } from "../common/Button";
import { formatNumber } from "../common/utils/formatNumber";
import { useClaimSelectionStore } from "./store/useClaimSelectionStore";

export const ClaimFloat = ({
  onClaimClicked,
}: {
  onClaimClicked: () => void;
}) => {
  const [
    selectedClaims,
    pointsClaimableByEpoch,
    showClaimModal,
    clearSelectedClaims,
  ] = useClaimSelectionStore((state) => [
    state.selectedClaims,
    state.pointsClaimableByEpoch,
    state.showClaimModal,
    state.clearSelectedClaims,
  ]);

  const { address } = useAccount();
  useEffect(() => {
    clearSelectedClaims();
  }, [address, clearSelectedClaims]);

  const totalPointsClaimable =
    selectedClaims.length > 0
      ? selectedClaims.reduce((acc, claim) => acc + claim.value, 0)
      : Object.values(pointsClaimableByEpoch).reduce(
          (acc, epoch) => acc + epoch,
          0,
        );

  const isVisible = totalPointsClaimable > 0 && !showClaimModal;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            translateY: "150%",
          }}
          animate={{
            translateY: "0%",
          }}
          exit={{
            translateY: "150%",
          }}
          key="ClaimPopover"
          className={twJoin(
            // position at bottom of container.
            "fixed bottom-4 w-[808px]",
            "bg-gray-900 flex flex-row justify-between p-5 rounded-md",
            "border border-gray-800",
            "shadow-[0_0_10px_8px] shadow-[#060607]",
          )}
        >
          <div className="flex flex-col">
            <span className="text-gray-500 font-bold text-xs uppercase">
              {selectedClaims.length ? "Selected Rewards" : "Total Rewards"}
            </span>

            <span className="text-[22px] leading-6 font-bold text-white">
              {formatNumber(totalPointsClaimable)} Points
            </span>
          </div>

          <Button color="primary" rounded={false} onClick={onClaimClicked}>
            {selectedClaims.length ? "Claim Selected" : "Claim All"}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
