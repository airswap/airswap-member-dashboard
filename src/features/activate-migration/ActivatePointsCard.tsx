import { motion } from "framer-motion";
import { useEffect } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { Checkbox } from "../common/Checkbox";
import { CheckMark } from "../common/icons/CheckMark";
import { formatNumber } from "../common/utils/formatNumber";
import { useHasClaimedForTree } from "../votes/hooks/useHasClaimedForTree";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";
import { ACTIVATE_TREE_ID } from "./constants";
import { useActivatePointsClaim } from "./hooks/useActivatePointsClaim";

export const ActivatePointsCard = ({}: {}) => {
  const { data: hasUserClaimed } = useHasClaimedForTree({
    treeId: ACTIVATE_TREE_ID,
  });

  const { isConnected: isWalletConnected } = useAccount();

  const IS_ENABLED = import.meta.env.VITE_ENABLE_ACTIVATE_MIGRATION === "true";

  const { data: activateMigrationClaim } = useActivatePointsClaim({
    enabled: IS_ENABLED,
  });

  const [
    addClaim,
    removeClaimForTree,
    setPointsClaimableForEpoch,
    isClaimSelected,
    setClaimSelected,
  ] = useClaimSelectionStore((state) => [
    state.addClaim,
    state.removeClaimForTree,
    state.setPointsClaimableForEpoch,
    state.isClaimSelected,
    state.setClaimSelected,
  ]);

  useEffect(() => {
    if (activateMigrationClaim && !hasUserClaimed) {
      setPointsClaimableForEpoch(
        ACTIVATE_TREE_ID,
        activateMigrationClaim.value,
      );
      addClaim(activateMigrationClaim);
    } else {
      setPointsClaimableForEpoch(ACTIVATE_TREE_ID, 0);
      removeClaimForTree(ACTIVATE_TREE_ID);
    }
  }, [
    addClaim,
    removeClaimForTree,
    hasUserClaimed,
    setPointsClaimableForEpoch,
    activateMigrationClaim,
  ]);

  return IS_ENABLED ? (
    activateMigrationClaim && (
      <motion.div
        className="w-full items-center border border-gray-800 rounded p-4 pl-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex w-full items-center justify-between pr-4 font-semibold">
          {/* Checkbox and title. */}
          <div className="flex items-center">
            {/* Checkbox */}
            <div className="align-center -mt-1 mr-5 items-center ">
              <Checkbox
                disabled={
                  hasUserClaimed // or if the user has already claimed
                }
                checked={isClaimSelected(ACTIVATE_TREE_ID)}
                onCheckedChange={(newState) => {
                  // Button will be disabled if there's no claim, so ! is ok.
                  setClaimSelected(
                    activateMigrationClaim!,
                    newState as boolean,
                  );
                }}
              />
            </div>
            {/* Title */}
            <div
              className={twMerge(
                "font-bold",
                hasUserClaimed && "text-gray-500",
              )}
            >
              Points from Activate
            </div>
          </div>

          {/* Points */}
          <div
            className={twJoin([
              "rounded-full px-4 py-1 text-xs font-bold uppercase leading-6",
              "flex flex-row items-center gap-2 ring-1 ring-gray-800",
              hasUserClaimed && "text-gray-500",
            ])}
          >
            {hasUserClaimed && (
              <span className="text-green-400">
                <CheckMark size={20} />
              </span>
            )}
            {/* TODO: small numbers of points probably don't need decimals. */}
            {formatNumber(activateMigrationClaim?.value)}
            &nbsp; Points {hasUserClaimed && " claimed "}
          </div>
        </div>
      </motion.div>
    )
  ) : (
    <div className="w-full items-center border border-gray-800 rounded p-4 pl-5">
      <div className="flex w-full items-center justify-between font-semibold">
        {/* Checkbox and title. */}
        <div className="flex items-center">
          {/* Checkbox */}
          <div
            className={twJoin(
              "align-center -mt-1 mr-5 items-center",
              !isWalletConnected && "hidden",
            )}
          >
            <Checkbox disabled />
          </div>
          {/* Title */}
          <div className={twMerge("font-bold text-gray-500")}>
            Points from Activate
          </div>
        </div>

        {/* Points */}
        <div
          className={twJoin([
            "rounded-full px-4 py-1 text-xs font-bold uppercase leading-6",
            "flex flex-row items-center gap-2 ring-1 ring-gray-800",
            "text-gray-500 text-center whitespace-nowrap",
          ])}
        >
          Coming soon
        </div>
      </div>
    </div>
  );
};
